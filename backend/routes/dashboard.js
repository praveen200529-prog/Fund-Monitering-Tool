const express = require('express');
const router = express.Router();
const db = require('../db');

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [[projectStats]] = await db.query(`
      SELECT 
        COUNT(*) AS total_projects,
        SUM(CASE WHEN status = 'ongoing' THEN 1 ELSE 0 END) AS ongoing,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'on_hold' THEN 1 ELSE 0 END) AS on_hold,
        COALESCE(SUM(estimated_budget), 0) AS total_budget
      FROM projects WHERE is_deleted = 0
    `);

    const [[workerStats]] = await db.query(`
      SELECT COUNT(*) AS total_workers,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active_workers
      FROM workers WHERE is_deleted = 0
    `);

    const [[machineStats]] = await db.query(`
      SELECT COUNT(*) AS total_machines,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available,
        SUM(CASE WHEN status = 'in_use' THEN 1 ELSE 0 END) AS in_use
      FROM machines_master WHERE is_deleted = 0
    `);

    const [[materialCost]] = await db.query(`
      SELECT COALESCE(SUM(quantity * unit_price), 0) AS total_material_cost
      FROM material_usage
    `);

    const [[manpowerCost]] = await db.query(`
      SELECT COALESCE(SUM(work_days * daily_rate), 0) AS total_manpower_cost
      FROM manpower_usage
    `);

    const [[machineCost]] = await db.query(`
      SELECT COALESCE(SUM(usage_hours * hourly_rate), 0) AS total_machine_cost
      FROM machine_usage
    `);

    const [[expenseTotal]] = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS total_expenses
      FROM expenses
    `);

    const [[investmentTotal]] = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS total_investments
      FROM project_investments
    `);

    const [[billingTotal]] = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS total_billed,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS total_paid
      FROM billing
    `);

    const totalActualCost = parseFloat(materialCost.total_material_cost) +
                            parseFloat(manpowerCost.total_manpower_cost) +
                            parseFloat(machineCost.total_machine_cost) +
                            parseFloat(expenseTotal.total_expenses);

    res.json({
      projects: projectStats,
      workers: workerStats,
      machines: machineStats,
      costs: {
        material: parseFloat(materialCost.total_material_cost),
        manpower: parseFloat(manpowerCost.total_manpower_cost),
        machine: parseFloat(machineCost.total_machine_cost),
        expenses: parseFloat(expenseTotal.total_expenses),
        total: totalActualCost
      },
      financial: {
        investments: parseFloat(investmentTotal.total_investments),
        billed: parseFloat(billingTotal.total_billed),
        paid: parseFloat(billingTotal.total_paid)
      },
      budgetComparison: {
        billable: parseFloat(projectStats.total_budget),
        actual: totalActualCost,
        billed: parseFloat(billingTotal.total_billed),
        profitLoss: parseFloat(billingTotal.total_billed) - totalActualCost,
        budgetVariance: parseFloat(projectStats.total_budget) - totalActualCost
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Per-project budget comparison
router.get('/budget-comparison', async (req, res) => {
  try {
    const [projects] = await db.query(`
      SELECT p.project_id, p.project_name, p.estimated_budget, p.status
      FROM projects p WHERE p.is_deleted = 0 ORDER BY p.project_id
    `);

    const result = [];

    for (const proj of projects) {
      const pid = proj.project_id;

      const [[matCost]] = await db.query(
        'SELECT COALESCE(SUM(quantity * unit_price), 0) AS cost FROM material_usage WHERE project_id = ?', [pid]
      );
      const [[manCost]] = await db.query(
        'SELECT COALESCE(SUM(work_days * daily_rate), 0) AS cost FROM manpower_usage WHERE project_id = ?', [pid]
      );
      const [[machCost]] = await db.query(
        'SELECT COALESCE(SUM(usage_hours * hourly_rate), 0) AS cost FROM machine_usage WHERE project_id = ?', [pid]
      );
      const [[expCost]] = await db.query(
        'SELECT COALESCE(SUM(amount), 0) AS cost FROM expenses WHERE project_id = ?', [pid]
      );
      const [[billAmt]] = await db.query(
        'SELECT COALESCE(SUM(amount), 0) AS total FROM billing WHERE project_id = ?', [pid]
      );

      const actualCost = parseFloat(matCost.cost) + parseFloat(manCost.cost) +
                          parseFloat(machCost.cost) + parseFloat(expCost.cost);

      result.push({
        project_id: pid,
        project_name: proj.project_name,
        status: proj.status,
        billable: parseFloat(proj.estimated_budget || 0),
        actual: actualCost,
        billed: parseFloat(billAmt.total),
        profitLoss: parseFloat(billAmt.total) - actualCost,
        budgetVariance: parseFloat(proj.estimated_budget || 0) - actualCost
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Material consumption summary
router.get('/material-summary', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT mm.material_id, mm.material_name, mm.unit, mm.unit_price AS catalog_price,
             COALESCE(SUM(mu.quantity), 0) AS total_consumed,
             COALESCE(SUM(mu.quantity * mu.unit_price), 0) AS total_cost,
             COUNT(DISTINCT mu.project_id) AS projects_used_in
      FROM materials_master mm
      LEFT JOIN material_usage mu ON mm.material_id = mu.material_id
      WHERE mm.is_deleted = 0
      GROUP BY mm.material_id, mm.material_name, mm.unit, mm.unit_price
      ORDER BY total_consumed DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alerts — overdue items, pending interest, delayed projects
router.get('/alerts', async (req, res) => {
  try {
    // Overdue billing
    const [overdueBills] = await db.query(`
      SELECT b.billing_id, b.invoice_number, b.amount, b.due_date, p.project_name
      FROM billing b
      JOIN projects p ON b.project_id = p.project_id
      WHERE b.status IN ('sent', 'draft') AND b.due_date < CURDATE()
      ORDER BY b.due_date ASC
    `);

    // Pending interest payments
    const [pendingInterest] = await db.query(`
      SELECT ip.id, ip.amount, ip.payment_date, ip.status,
             pl.principal, pl.interest_rate, p.project_name, f.name AS financier_name
      FROM interest_payments ip
      JOIN project_loans pl ON ip.loan_id = pl.id
      JOIN projects p ON pl.project_id = p.project_id
      JOIN financiers f ON pl.financier_id = f.financier_id
      WHERE ip.status = 'pending'
      ORDER BY ip.payment_date ASC
    `);

    // Projects over budget
    const [projects] = await db.query(`
      SELECT p.project_id, p.project_name, p.estimated_budget
      FROM projects p WHERE p.is_deleted = 0 AND p.estimated_budget > 0
    `);

    const overBudget = [];
    for (const proj of projects) {
      const [[total]] = await db.query(`
        SELECT (
          COALESCE((SELECT SUM(quantity * unit_price) FROM material_usage WHERE project_id = ?), 0) +
          COALESCE((SELECT SUM(work_days * daily_rate) FROM manpower_usage WHERE project_id = ?), 0) +
          COALESCE((SELECT SUM(usage_hours * hourly_rate) FROM machine_usage WHERE project_id = ?), 0) +
          COALESCE((SELECT SUM(amount) FROM expenses WHERE project_id = ?), 0)
        ) AS actual_cost
      `, [proj.project_id, proj.project_id, proj.project_id, proj.project_id]);

      if (parseFloat(total.actual_cost) > parseFloat(proj.estimated_budget)) {
        overBudget.push({
          project_id: proj.project_id,
          project_name: proj.project_name,
          estimated_budget: parseFloat(proj.estimated_budget),
          actual_cost: parseFloat(total.actual_cost),
          overBy: parseFloat(total.actual_cost) - parseFloat(proj.estimated_budget)
        });
      }
    }

    // Delayed projects (end_date passed but status is still ongoing)
    const [delayedProjects] = await db.query(`
      SELECT project_id, project_name, end_date, status
      FROM projects
      WHERE is_deleted = 0 AND status = 'ongoing' AND end_date < CURDATE()
      ORDER BY end_date ASC
    `);

    // Interest auto-calculation for active loans
    const [activeLoans] = await db.query(`
      SELECT pl.id, pl.principal, pl.interest_rate, pl.start_date, pl.end_date,
             p.project_name, f.name AS financier_name,
             COALESCE((SELECT SUM(ip.amount) FROM interest_payments ip WHERE ip.loan_id = pl.id AND ip.status = 'paid'), 0) AS total_paid,
             ROUND(pl.principal * pl.interest_rate / 100 / 12, 2) AS monthly_interest,
             TIMESTAMPDIFF(MONTH, pl.start_date, CURDATE()) AS months_elapsed
      FROM project_loans pl
      JOIN projects p ON pl.project_id = p.project_id
      JOIN financiers f ON pl.financier_id = f.financier_id
      ORDER BY pl.start_date DESC
    `);

    const loanAlerts = activeLoans.map(loan => {
      const expectedPaid = loan.monthly_interest * loan.months_elapsed;
      const shortfall = expectedPaid - parseFloat(loan.total_paid);
      return {
        ...loan,
        total_paid: parseFloat(loan.total_paid),
        expected_total: expectedPaid,
        shortfall: shortfall > 0 ? shortfall : 0,
        status: shortfall > 0 ? 'behind' : 'on_track'
      };
    });

    res.json({
      overdueBills,
      pendingInterest,
      overBudget,
      delayedProjects,
      loanAlerts,
      totalAlerts: overdueBills.length + pendingInterest.length + overBudget.length + delayedProjects.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recent activities
router.get('/recent', async (req, res) => {
  try {
    const [recentProjects] = await db.query(`
      SELECT project_id, project_name, status, created_at, 'project' AS type
      FROM projects WHERE is_deleted = 0
      ORDER BY created_at DESC LIMIT 5
    `);

    const [recentExpenses] = await db.query(`
      SELECT e.expense_id, p.project_name, e.amount, ec.category_name, e.expense_date, 'expense' AS type
      FROM expenses e
      JOIN projects p ON e.project_id = p.project_id
      JOIN expense_categories ec ON e.category_id = ec.category_id
      ORDER BY e.created_at DESC LIMIT 5
    `);

    res.json({ recentProjects, recentExpenses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
