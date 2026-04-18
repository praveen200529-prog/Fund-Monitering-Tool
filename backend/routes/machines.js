const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all machines
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM machines_master WHERE is_deleted = 0 ORDER BY machine_id'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single machine
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM machines_master WHERE machine_id = ? AND is_deleted = 0',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Machine not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create machine
router.post('/', async (req, res) => {
  try {
    const { machine_name, machine_type, hourly_rate, ownership_type, status } = req.body;
    const [result] = await db.query(
      `INSERT INTO machines_master (machine_name, machine_type, hourly_rate, ownership_type, status)
       VALUES (?, ?, ?, ?, ?)`,
      [machine_name, machine_type || null, hourly_rate || null, ownership_type || 'owned', status || 'available']
    );
    res.status(201).json({ machine_id: result.insertId, machine_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update machine
router.put('/:id', async (req, res) => {
  try {
    const { machine_name, machine_type, hourly_rate, ownership_type, status } = req.body;
    await db.query(
      `UPDATE machines_master SET machine_name = ?, machine_type = ?, hourly_rate = ?,
       ownership_type = ?, status = ? WHERE machine_id = ?`,
      [machine_name, machine_type || null, hourly_rate || null, ownership_type, status, req.params.id]
    );
    res.json({ message: 'Machine updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'UPDATE machines_master SET is_deleted = 1 WHERE machine_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Machine soft-deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
