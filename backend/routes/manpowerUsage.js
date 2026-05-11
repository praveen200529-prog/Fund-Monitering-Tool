const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all manpower usage
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT mu.*, p.project_name, w.name AS worker_name, wr.role_name AS worker_role_name,
             u.name AS recorded_by_name, (mu.work_days * mu.daily_rate) AS total_cost
      FROM manpower_usage mu
      JOIN projects p ON mu.project_id = p.project_id AND p.is_deleted = 0
      JOIN workers w ON mu.worker_id = w.worker_id
      LEFT JOIN worker_roles wr ON w.worker_role_id = wr.worker_role_id
      LEFT JOIN users u ON mu.recorded_by = u.user_id
      ORDER BY mu.work_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by project
router.get('/project/:projectId', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT mu.*, w.name AS worker_name, wr.role_name AS worker_role_name,
             u.name AS recorded_by_name, (mu.work_days * mu.daily_rate) AS total_cost
      FROM manpower_usage mu
      JOIN workers w ON mu.worker_id = w.worker_id
      LEFT JOIN worker_roles wr ON w.worker_role_id = wr.worker_role_id
      LEFT JOIN users u ON mu.recorded_by = u.user_id
      WHERE mu.project_id = ?
      ORDER BY mu.work_date DESC
    `, [req.params.projectId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM manpower_usage WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { project_id, worker_id, work_days, daily_rate, work_date, recorded_by } = req.body;
    const [result] = await db.query(
      `INSERT INTO manpower_usage (project_id, worker_id, work_days, daily_rate, work_date, recorded_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [project_id, worker_id, work_days, daily_rate, work_date, recorded_by || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { project_id, worker_id, work_days, daily_rate, work_date, recorded_by } = req.body;
    await db.query(
      `UPDATE manpower_usage SET project_id = ?, worker_id = ?, work_days = ?,
       daily_rate = ?, work_date = ?, recorded_by = ? WHERE id = ?`,
      [project_id, worker_id, work_days, daily_rate, work_date, recorded_by || null, req.params.id]
    );
    res.json({ message: 'Manpower usage updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM manpower_usage WHERE id = ?', [req.params.id]);
    res.json({ message: 'Manpower usage deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
