const express = require('express');
const router = express.Router();
const { memoryDb } = require('../db');
const tenantScope = require('../middleware/tenantScope');

router.use(tenantScope);

// GET /api/suppliers - List suppliers for tenant
router.get('/', (req, res) => {
  const suppliers = memoryDb.suppliers.filter(s => s.tenant_id === req.tenantId || s.tenant_id === 'tenant_01');
  res.json({
    total: suppliers.length,
    suppliers
  });
});

// POST /api/suppliers/negotiate - Custom Non-RESTful route for A2A Supplier Negotiation
router.post('/negotiate', (req, res) => {
  const { sku, item_name, target_price, quantity } = req.body;

  if (!sku || !target_price || !quantity) {
    return res.status(400).json({ error: true, message: 'Missing required negotiation parameters: sku, target_price, quantity' });
  }

  const supplier = memoryDb.suppliers.find(s => s.tenant_id === req.tenantId) || memoryDb.suppliers[0];
  const negotiatedUnitPrice = Number((target_price * 0.93).toFixed(2)); // Negotiates 7% discount
  const totalCost = Number((negotiatedUnitPrice * quantity).toFixed(2));

  const negotiationResult = {
    negotiation_id: `neg_${Date.now()}`,
    tenant_id: req.tenantId,
    sku,
    item_name: item_name || 'Supply Chain Component',
    supplier_name: supplier.name,
    supplier_id: supplier.id,
    requested_quantity: quantity,
    original_target_price: target_price,
    negotiated_unit_price: negotiatedUnitPrice,
    discount_percentage: '7%',
    lead_time_days: supplier.lead_time_days || 3,
    total_quote: totalCost,
    status: 'COMPLETED',
    timestamp: new Date().toISOString()
  };

  memoryDb.a2a_negotiations.unshift(negotiationResult);

  res.json({
    message: 'A2A Agent-to-Agent Supplier Negotiation completed successfully.',
    negotiation: negotiationResult
  });
});

// POST /api/suppliers - Create supplier
router.post('/', (req, res) => {
  const { name, email, rating, lead_time_days } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: true, message: 'Supplier name and email are required.' });
  }

  const newSupplier = {
    id: `sup_${Date.now()}`,
    tenant_id: req.tenantId,
    name,
    email,
    rating: Number(rating || 4.5),
    lead_time_days: Number(lead_time_days || 3),
    created_at: new Date().toISOString()
  };

  memoryDb.suppliers.push(newSupplier);

  res.status(201).json({
    message: 'Supplier created successfully.',
    supplier: newSupplier
  });
});

module.exports = router;
