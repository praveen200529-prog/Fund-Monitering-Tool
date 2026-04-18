const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all team assignments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pt.*, p.project_name, u.name AS user_name, u.email
      FROM project_team pt
      JOIN projects p ON pt.project_id = p.project_id
      JOIN users u ON pt.user_id = u.user_id
      ORDER BY pt.created_at DESC
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
      SELECT pt.*, u.name AS user_name, u.email
      FROM project_team pt
      JOIN users u ON pt.user_id = u.user_id
      WHERE pt.project_id = ?
      ORDER BY pt.role
    `, [req.params.projectId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { project_id, user_id, role, joined_at } = req.body;
    const [result] = await db.query(
      'INSERT INTO project_team (project_id, user_id, role, joined_at) VALUES (?, ?, ?, ?)',
      [project_id, user_id, role, joined_at || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { project_id, user_id, role, joined_at } = req.body;
    await db.query(
      'UPDATE project_team SET project_id = ?, user_id = ?, role = ?, joined_at = ? WHERE id = ?',
      [project_id, user_id, role, joined_at || null, req.params.id]
    );
    res.json({ message: 'Team assignment updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM project_team WHERE id = ?', [req.params.id]);
    res.json({ message: 'Team member removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
