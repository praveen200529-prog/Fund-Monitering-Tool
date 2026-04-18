const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all workers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT w.*, wr.role_name AS worker_role_name
      FROM workers w
      LEFT JOIN worker_roles wr ON w.worker_role_id = wr.worker_role_id
      WHERE w.is_deleted = 0
      ORDER BY w.worker_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single worker
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT w.*, wr.role_name AS worker_role_name
      FROM workers w
      LEFT JOIN worker_roles wr ON w.worker_role_id = wr.worker_role_id
      WHERE w.worker_id = ? AND w.is_deleted = 0
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Worker not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create worker
router.post('/', async (req, res) => {
  try {
    const { name, contact, aadhar_number, worker_role_id, daily_rate } = req.body;
    const [result] = await db.query(
      `INSERT INTO workers (name, contact, aadhar_number, worker_role_id, daily_rate)
       VALUES (?, ?, ?, ?, ?)`,
      [name, contact || null, aadhar_number || null, worker_role_id || null, daily_rate || null]
    );
    res.status(201).json({ worker_id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update worker
router.put('/:id', async (req, res) => {
  try {
    const { name, contact, aadhar_number, worker_role_id, daily_rate, is_active } = req.body;
    await db.query(
      `UPDATE workers SET name = ?, contact = ?, aadhar_number = ?, worker_role_id = ?,
       daily_rate = ?, is_active = ? WHERE worker_id = ?`,
      [name, contact || null, aadhar_number || null, worker_role_id || null, daily_rate || null, is_active !== undefined ? is_active : 1, req.params.id]
    );
    res.json({ message: 'Worker updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'UPDATE workers SET is_deleted = 1, deleted_at = NOW() WHERE worker_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Worker soft-deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
