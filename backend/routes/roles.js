const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all roles
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM roles ORDER BY role_id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single role
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM roles WHERE role_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Role not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create role
router.post('/', async (req, res) => {
  try {
    const { role_name } = req.body;
    const [result] = await db.query('INSERT INTO roles (role_name) VALUES (?)', [role_name]);
    res.status(201).json({ role_id: result.insertId, role_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update role
router.put('/:id', async (req, res) => {
  try {
    const { role_name } = req.body;
    await db.query('UPDATE roles SET role_name = ? WHERE role_id = ?', [role_name, req.params.id]);
    res.json({ message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE role
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM roles WHERE role_id = ?', [req.params.id]);
    res.json({ message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
