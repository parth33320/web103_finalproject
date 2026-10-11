function validateInventoryPayload(req, res, next) {
  const { sku, name, quantity, spot_rate, category } = req.body;

  if (req.method === 'POST') {
    if (!sku || typeof sku !== 'string' || sku.trim() === '') {
      return res.status(400).json({ error: true, message: 'Validation Error: SKU is required and must be a non-empty string.' });
    }
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: true, message: 'Validation Error: Name is required.' });
    }
    if (quantity === undefined || typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ error: true, message: 'Validation Error: Quantity must be a non-negative number.' });
    }
    if (spot_rate === undefined || typeof spot_rate !== 'number' || spot_rate < 0) {
      return res.status(400).json({ error: true, message: 'Validation Error: Spot rate must be a non-negative number.' });
    }
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0)) {
      return res.status(400).json({ error: true, message: 'Validation Error: Quantity must be a non-negative number.' });
    }
    if (spot_rate !== undefined && (typeof spot_rate !== 'number' || spot_rate < 0)) {
      return res.status(400).json({ error: true, message: 'Validation Error: Spot rate must be a non-negative number.' });
    }
  }

  next();
}

module.exports = {
  validateInventoryPayload
};
