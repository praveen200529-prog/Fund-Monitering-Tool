const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all loans
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pl.*, p.project_name, f.name AS financier_name, u.name AS created_by_name
      FROM project_loans pl
      JOIN projects p ON pl.project_id = p.project_id AND p.is_deleted = 0
      JOIN financiers f ON pl.financier_id = f.financier_id
      LEFT JOIN users u ON pl.created_by = u.user_id
      ORDER BY pl.start_date DESC
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
      SELECT pl.*, f.name AS financier_name, u.name AS created_by_name
      FROM project_loans pl
      JOIN financiers f ON pl.financier_id = f.financier_id
      LEFT JOIN users u ON pl.created_by = u.user_id
      WHERE pl.project_id = ?
      ORDER BY pl.start_date DESC
    `, [req.params.projectId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM project_loans WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Loan not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { project_id, financier_id, principal, interest_rate, start_date, end_date, created_by } = req.body;
    const [result] = await db.query(
      `INSERT INTO project_loans (project_id, financier_id, principal, interest_rate, start_date, end_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [project_id, financier_id, principal, interest_rate, start_date, end_date || null, created_by || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { project_id, financier_id, principal, interest_rate, start_date, end_date } = req.body;
    await db.query(
      `UPDATE project_loans SET project_id = ?, financier_id = ?, principal = ?,
       interest_rate = ?, start_date = ?, end_date = ? WHERE id = ?`,
      [project_id, financier_id, principal, interest_rate, start_date, end_date || null, req.params.id]
    );
    res.json({ message: 'Loan updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM project_loans WHERE id = ?', [req.params.id]);
    res.json({ message: 'Loan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
