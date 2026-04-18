const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all worker roles
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM worker_roles ORDER BY worker_role_id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single worker role
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM worker_roles WHERE worker_role_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Worker role not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create worker role
router.post('/', async (req, res) => {
  try {
    const { role_name, daily_rate } = req.body;
    const [result] = await db.query(
      'INSERT INTO worker_roles (role_name, daily_rate) VALUES (?, ?)',
      [role_name, daily_rate || null]
    );
    res.status(201).json({ worker_role_id: result.insertId, role_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update worker role
router.put('/:id', async (req, res) => {
  try {
    const { role_name, daily_rate } = req.body;
    await db.query(
      'UPDATE worker_roles SET role_name = ?, daily_rate = ? WHERE worker_role_id = ?',
      [role_name, daily_rate || null, req.params.id]
    );
    res.json({ message: 'Worker role updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE worker role
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM worker_roles WHERE worker_role_id = ?', [req.params.id]);
    res.json({ message: 'Worker role deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
