const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all financiers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM financiers ORDER BY financier_id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM financiers WHERE financier_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Financier not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const [result] = await db.query(
      'INSERT INTO financiers (name, phone, email) VALUES (?, ?, ?)',
      [name, phone || null, email || null]
    );
    res.status(201).json({ financier_id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    await db.query(
      'UPDATE financiers SET name = ?, phone = ?, email = ? WHERE financier_id = ?',
      [name, phone || null, email || null, req.params.id]
    );
    res.json({ message: 'Financier updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM financiers WHERE financier_id = ?', [req.params.id]);
    res.json({ message: 'Financier deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
