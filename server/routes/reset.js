const express = require('express');
const router = express.Router();
const { memoryDb } = require('../db');

// POST /api/reset - Restore database to default seeded state
router.post('/', (req, res) => {
  memoryDb.reset();
  res.json({
    success: true,
    message: 'Database successfully reset to default seeded state.'
  });
});

module.exports = router;
