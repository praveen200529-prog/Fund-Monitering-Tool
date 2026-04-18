const express = require('express');
const router = express.Router();
const db = require('../db');

// GET audit logs (read-only, with pagination)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const [rows] = await db.query(`
      SELECT al.*, u.name AS changed_by_name
      FROM db_audit_log al
      LEFT JOIN users u ON al.changed_by = u.user_id
      ORDER BY al.changed_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    const [countResult] = await db.query('SELECT COUNT(*) AS total FROM db_audit_log');
    
    res.json({
      data: rows,
      total: countResult[0].total,
      limit,
      offset
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by table
router.get('/table/:tableName', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT al.*, u.name AS changed_by_name
      FROM db_audit_log al
      LEFT JOIN users u ON al.changed_by = u.user_id
      WHERE al.table_name = ?
      ORDER BY al.changed_at DESC
      LIMIT 100
    `, [req.params.tableName]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
