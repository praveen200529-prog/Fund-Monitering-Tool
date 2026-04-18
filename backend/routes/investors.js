const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all investors
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM investors ORDER BY investor_id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM investors WHERE investor_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Investor not found' });
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
      'INSERT INTO investors (name, phone, email) VALUES (?, ?, ?)',
      [name, phone || null, email || null]
    );
    res.status(201).json({ investor_id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    await db.query(
      'UPDATE investors SET name = ?, phone = ?, email = ? WHERE investor_id = ?',
      [name, phone || null, email || null, req.params.id]
    );
    res.json({ message: 'Investor updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM investors WHERE investor_id = ?', [req.params.id]);
    res.json({ message: 'Investor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
