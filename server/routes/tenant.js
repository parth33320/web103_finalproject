const express = require('express');
const router = express.Router();
const { memoryDb } = require('../db');
const tenantScope = require('../middleware/tenantScope');

router.use(tenantScope);

// GET /api/tenant/settings - 1:1 tenant to tenant_settings relationship
router.get('/settings', (req, res) => {
  const tenant = memoryDb.tenants.find(t => t.id === req.tenantId) || { id: req.tenantId, name: 'Acme Corp' };
  const settings = req.tenantSettings;

  res.json({
    tenant,
    settings
  });
});

// PUT /api/tenant/settings - Update 1:1 tenant settings
router.put('/settings', (req, res) => {
  const settingsIndex = memoryDb.tenant_settings.findIndex(ts => ts.tenant_id === req.tenantId);
  const updatedSettings = {
    ...req.tenantSettings,
    ...req.body,
    updated_at: new Date().toISOString()
  };

  if (settingsIndex !== -1) {
    memoryDb.tenant_settings[settingsIndex] = updatedSettings;
  } else {
    memoryDb.tenant_settings.push(updatedSettings);
  }

  res.json({
    message: 'Tenant configuration settings updated successfully.',
    settings: updatedSettings
  });
});

// POST /api/tenant/reallocate - Custom Non-RESTful route for logistics reallocation
router.post('/reallocate', (req, res) => {
  const { source_warehouse, target_warehouse, sku, reallocate_quantity } = req.body;

  if (!sku || !reallocate_quantity) {
    return res.status(400).json({ error: true, message: 'Missing required reallocation parameters: sku, reallocate_quantity' });
  }

  const item = memoryDb.inventory.find(i => i.sku === sku && i.tenant_id === req.tenantId) || memoryDb.inventory[0];

  const reallocationAction = {
    reallocation_id: `realloc_${Date.now()}`,
    tenant_id: req.tenantId,
    sku: item ? item.sku : sku,
    item_name: item ? item.name : 'Component',
    source_warehouse: source_warehouse || 'Warehouse Alpha (East)',
    target_warehouse: target_warehouse || 'Warehouse Beta (West)',
    quantity: Number(reallocate_quantity),
    status: 'EXECUTED',
    timestamp: new Date().toISOString()
  };

  res.json({
    message: `Reallocated ${reallocate_quantity} units of ${item ? item.sku : sku} successfully across regional hubs.`,
    reallocation: reallocationAction
  });
});

module.exports = router;
