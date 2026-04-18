const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all investments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pi.*, p.project_name, i.name AS investor_name, u.name AS created_by_name
      FROM project_investments pi
      JOIN projects p ON pi.project_id = p.project_id
      JOIN investors i ON pi.investor_id = i.investor_id
      LEFT JOIN users u ON pi.created_by = u.user_id
      ORDER BY pi.investment_date DESC
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
      SELECT pi.*, i.name AS investor_name, u.name AS created_by_name
      FROM project_investments pi
      JOIN investors i ON pi.investor_id = i.investor_id
      LEFT JOIN users u ON pi.created_by = u.user_id
      WHERE pi.project_id = ?
      ORDER BY pi.investment_date DESC
    `, [req.params.projectId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM project_investments WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Investment not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { project_id, investor_id, amount, investment_date, notes, created_by } = req.body;
    const [result] = await db.query(
      `INSERT INTO project_investments (project_id, investor_id, amount, investment_date, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [project_id, investor_id, amount, investment_date, notes || null, created_by || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { project_id, investor_id, amount, investment_date, notes } = req.body;
    await db.query(
      `UPDATE project_investments SET project_id = ?, investor_id = ?, amount = ?,
       investment_date = ?, notes = ? WHERE id = ?`,
      [project_id, investor_id, amount, investment_date, notes || null, req.params.id]
    );
    res.json({ message: 'Investment updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM project_investments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Investment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
