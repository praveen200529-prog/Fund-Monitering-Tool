const db = require('./db');

async function migrate() {
  try {
    await db.query('ALTER TABLE materials_master ADD COLUMN total_purchased DECIMAL(12,2) DEFAULT 0 AFTER unit_price');
    console.log('Added total_purchased to materials_master');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column total_purchased already exists');
    } else {
      console.error(err);
    }
  }
  process.exit();
}

migrate();
