const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all interest payments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ip.*, pl.principal, pl.interest_rate, pl.project_id,
             p.project_name, f.name AS financier_name, u.name AS created_by_name
      FROM interest_payments ip
      JOIN project_loans pl ON ip.loan_id = pl.id
      JOIN projects p ON pl.project_id = p.project_id
      JOIN financiers f ON pl.financier_id = f.financier_id
      LEFT JOIN users u ON ip.created_by = u.user_id
      ORDER BY ip.payment_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by loan
router.get('/loan/:loanId', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ip.*, u.name AS created_by_name
      FROM interest_payments ip
      LEFT JOIN users u ON ip.created_by = u.user_id
      WHERE ip.loan_id = ?
      ORDER BY ip.payment_date DESC
    `, [req.params.loanId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM interest_payments WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Payment not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { loan_id, payment_date, amount, status, created_by } = req.body;
    const [result] = await db.query(
      `INSERT INTO interest_payments (loan_id, payment_date, amount, status, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [loan_id, payment_date, amount, status || 'pending', created_by || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { loan_id, payment_date, amount, status } = req.body;
    await db.query(
      'UPDATE interest_payments SET loan_id = ?, payment_date = ?, amount = ?, status = ? WHERE id = ?',
      [loan_id, payment_date, amount, status, req.params.id]
    );
    res.json({ message: 'Interest payment updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM interest_payments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Interest payment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
