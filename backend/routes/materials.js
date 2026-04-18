const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all materials
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*,
             COALESCE(m.total_purchased, 0) - COALESCE(SUM(u.quantity), 0) AS current_stock
      FROM materials_master m
      LEFT JOIN material_usage u ON m.material_id = u.material_id
      WHERE m.is_deleted = 0
      GROUP BY m.material_id
      ORDER BY m.material_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single material
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*,
             COALESCE(m.total_purchased, 0) - COALESCE(SUM(u.quantity), 0) AS current_stock
      FROM materials_master m
      LEFT JOIN material_usage u ON m.material_id = u.material_id
      WHERE m.material_id = ? AND m.is_deleted = 0
      GROUP BY m.material_id
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Material not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create material
router.post('/', async (req, res) => {
  try {
    const { material_name, unit, unit_price, total_purchased } = req.body;
    const [result] = await db.query(
      'INSERT INTO materials_master (material_name, unit, unit_price, total_purchased) VALUES (?, ?, ?, ?)',
      [material_name, unit, unit_price || null, total_purchased || 0]
    );
    res.status(201).json({ material_id: result.insertId, material_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update material
router.put('/:id', async (req, res) => {
  try {
    const { material_name, unit, unit_price, total_purchased } = req.body;
    await db.query(
      'UPDATE materials_master SET material_name = ?, unit = ?, unit_price = ?, total_purchased = ? WHERE material_id = ?',
      [material_name, unit, unit_price || null, total_purchased || 0, req.params.id]
    );
    res.json({ message: 'Material updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'UPDATE materials_master SET is_deleted = 1 WHERE material_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Material soft-deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
