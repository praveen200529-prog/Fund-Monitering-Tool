const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all progress records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pp.*, p.project_name, u.name AS recorded_by_name
      FROM project_progress pp
      JOIN projects p ON pp.project_id = p.project_id
      LEFT JOIN users u ON pp.recorded_by = u.user_id
      ORDER BY pp.year DESC, pp.month DESC
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
      SELECT pp.*, u.name AS recorded_by_name
      FROM project_progress pp
      LEFT JOIN users u ON pp.recorded_by = u.user_id
      WHERE pp.project_id = ?
      ORDER BY pp.year DESC, pp.month DESC
    `, [req.params.projectId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM project_progress WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { project_id, month, year, progress_percentage, remarks, recorded_by } = req.body;
    const [result] = await db.query(
      `INSERT INTO project_progress (project_id, month, year, progress_percentage, remarks, recorded_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [project_id, month, year, progress_percentage, remarks || null, recorded_by || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { project_id, month, year, progress_percentage, remarks } = req.body;
    await db.query(
      `UPDATE project_progress SET project_id = ?, month = ?, year = ?,
       progress_percentage = ?, remarks = ? WHERE id = ?`,
      [project_id, month, year, progress_percentage, remarks || null, req.params.id]
    );
    res.json({ message: 'Progress updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM project_progress WHERE id = ?', [req.params.id]);
    res.json({ message: 'Progress record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
