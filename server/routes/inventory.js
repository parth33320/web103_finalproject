const express = require('express');
const router = express.Router();
const { memoryDb } = require('../db');
const tenantScope = require('../middleware/tenantScope');
const { validateInventoryPayload } = require('../middleware/validate');
const { triggerStockoutPOAutomation } = require('../services/poAutomation');

router.use(tenantScope);

// GET /api/inventory - List inventory scoped by tenant
router.get('/', (req, res) => {
  const { category, search, sort } = req.query;
  let items = memoryDb.inventory.filter(i => i.tenant_id === req.tenantId);

  if (category && category !== 'ALL') {
    items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const term = search.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(term) || i.sku.toLowerCase().includes(term));
  }

  if (sort) {
    if (sort === 'quantity_asc') items.sort((a, b) => a.quantity - b.quantity);
    if (sort === 'quantity_desc') items.sort((a, b) => b.quantity - a.quantity);
    if (sort === 'rate_asc') items.sort((a, b) => a.spot_rate - b.spot_rate);
    if (sort === 'rate_desc') items.sort((a, b) => b.spot_rate - a.spot_rate);
    if (sort === 'name_asc') items.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json({
    tenant_id: req.tenantId,
    total: items.length,
    items: items
  });
});

// GET /api/inventory/:id - View single inventory item with supplier junction info
router.get('/:id', (req, res) => {
  const item = memoryDb.inventory.find(i => i.id === req.params.id && i.tenant_id === req.tenantId);
  if (!item) {
    return res.status(404).json({ error: true, message: 'Inventory item not found.' });
  }

  // Find suppliers connected via M:M join table inventory_suppliers
  const supplierRels = memoryDb.inventory_suppliers.filter(is => is.inventory_id === item.id);
  const connectedSuppliers = supplierRels.map(rel => {
    const supplier = memoryDb.suppliers.find(s => s.id === rel.supplier_id);
    return {
      ...supplier,
      unit_cost: rel.unit_cost,
      is_primary: rel.is_primary, // Unique field in join table
      supplier_lead_time: rel.supplier_lead_time
    };
  });

  res.json({
    item,
    suppliers: connectedSuppliers
  });
});

// POST /api/inventory - Create new inventory item
router.post('/', validateInventoryPayload, (req, res) => {
  const { sku, name, category, quantity, reorder_point, spot_rate, image_url } = req.body;

  const newItem = {
    id: `inv_${Date.now()}`,
    tenant_id: req.tenantId,
    sku,
    name,
    category: category || 'General',
    quantity: Number(quantity),
    reorder_point: Number(reorder_point || 15),
    spot_rate: Number(spot_rate),
    image_url: image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  memoryDb.inventory.unshift(newItem);

  // Link to primary supplier if available
  const defaultSupplier = memoryDb.suppliers.find(s => s.tenant_id === req.tenantId) || memoryDb.suppliers[0];
  if (defaultSupplier) {
    memoryDb.inventory_suppliers.push({
      id: `is_${Date.now()}`,
      inventory_id: newItem.id,
      supplier_id: defaultSupplier.id,
      unit_cost: newItem.spot_rate,
      is_primary: true,
      supplier_lead_time: 3
    });
  }

  res.status(201).json({
    message: 'Inventory item created successfully.',
    item: newItem
  });
});

// PATCH /api/inventory/:id - Update item (Triggers stockout PO automation if qty reaches 0)
router.patch('/:id', validateInventoryPayload, (req, res) => {
  const itemIndex = memoryDb.inventory.findIndex(i => i.id === req.params.id && i.tenant_id === req.tenantId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: true, message: 'Inventory item not found.' });
  }

  const existingItem = memoryDb.inventory[itemIndex];
  const updatedItem = {
    ...existingItem,
    ...req.body,
    quantity: req.body.quantity !== undefined ? Number(req.body.quantity) : existingItem.quantity,
    spot_rate: req.body.spot_rate !== undefined ? Number(req.body.spot_rate) : existingItem.spot_rate,
    updated_at: new Date().toISOString()
  };

  memoryDb.inventory[itemIndex] = updatedItem;

  let poTriggerResult = null;
  // Trigger stockout PO automation if quantity was updated to 0
  if (updatedItem.quantity === 0) {
    poTriggerResult = triggerStockoutPOAutomation(updatedItem, req.tenantId);
  }

  res.json({
    message: updatedItem.quantity === 0 ? 'Item stockout recorded! Automated PO generated.' : 'Inventory item updated successfully.',
    item: updatedItem,
    poTriggered: poTriggerResult
  });
});

// DELETE /api/inventory/:id - Delete inventory item
router.delete('/:id', (req, res) => {
  const index = memoryDb.inventory.findIndex(i => i.id === req.params.id && i.tenant_id === req.tenantId);
  if (index === -1) {
    return res.status(404).json({ error: true, message: 'Inventory item not found.' });
  }

  const deletedItem = memoryDb.inventory.splice(index, 1)[0];
  // Remove join table references
  memoryDb.inventory_suppliers = memoryDb.inventory_suppliers.filter(is => is.inventory_id !== req.params.id);

  res.json({
    message: 'Inventory item deleted successfully.',
    item: deletedItem
  });
});

module.exports = router;
