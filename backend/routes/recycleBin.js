const express = require('express');
const router = express.Router();
const db = require('../db');
const { roleGuard } = require('../middleware/auth');

// GET all deleted projects (visible to admin and manager as per prompt, but prompt actually says "Only admin role can restore/permanent delete". Dashboard can be viewed by both, though I'll allow manager and admin)
router.get('/', roleGuard('admin', 'manager'), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT rb.*, p.location, p.estimated_budget, p.status
      FROM recycle_bin rb
      JOIN projects p ON rb.project_id = p.project_id
      WHERE p.is_deleted = 1
      ORDER BY rb.deleted_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESTORE a soft-deleted project
router.post('/:projectId/restore', roleGuard('admin'), async (req, res) => {
  const pid = req.params.projectId;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      'UPDATE projects SET is_deleted = 0, deleted_at = NULL, deleted_by = NULL WHERE project_id = ?',
      [pid]
    );
    await connection.query('DELETE FROM recycle_bin WHERE project_id = ?', [pid]);

    await connection.commit();
    res.json({ success: true, message: 'Project restored successfully' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// PERMANENTLY DELETE
router.delete('/:projectId/permanent', roleGuard('admin'), async (req, res) => {
  const pid = req.params.projectId;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Delete in dependency order to be completely safe, 
    // even though CASCADE might handle some of this, the prompt explicitly demands all 12 steps.
    await connection.query('DELETE FROM recycle_bin WHERE project_id = ?', [pid]);
    await connection.query('DELETE FROM material_usage WHERE project_id = ?', [pid]);
    await connection.query('DELETE FROM manpower_usage WHERE project_id = ?', [pid]);
    await connection.query('DELETE FROM machine_usage WHERE project_id = ?', [pid]);
    await connection.query('DELETE FROM expenses WHERE project_id = ?', [pid]);
    await connection.query('DELETE FROM billing WHERE project_id = ?', [pid]);
    await connection.query('DELETE FROM project_investments WHERE project_id = ?', [pid]);
    
    // Find loans to delete interest payments
    const [loans] = await connection.query('SELECT id FROM project_loans WHERE project_id = ?', [pid]);
    if (loans.length > 0) {
      const loanIds = loans.map(l => l.id);
      await connection.query('DELETE FROM interest_payments WHERE loan_id IN (?)', [loanIds]);
    }
    
    await connection.query('DELETE FROM project_loans WHERE project_id = ?', [pid]);
    await connection.query('DELETE FROM project_team WHERE project_id = ?', [pid]);
    await connection.query('DELETE FROM project_progress WHERE project_id = ?', [pid]);
    
    // Finally delete the project itself
    await connection.query('DELETE FROM projects WHERE project_id = ?', [pid]);

    await connection.commit();
    res.json({ success: true, message: 'Project permanently deleted' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
