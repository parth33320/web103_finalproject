const express = require('express');
const router = express.Router();
const { memoryDb } = require('../db');
const tenantScope = require('../middleware/tenantScope');

router.use(tenantScope);

// GET /api/purchase-orders - List purchase orders for tenant
router.get('/', (req, res) => {
  const orders = memoryDb.purchase_orders.filter(po => po.tenant_id === req.tenantId);

  const enrichedOrders = orders.map(po => {
    const supplier = memoryDb.suppliers.find(s => s.id === po.supplier_id) || { name: 'Apex Electronics' };
    const items = memoryDb.po_items.filter(poi => poi.po_id === po.id).map(poi => {
      const invItem = memoryDb.inventory.find(i => i.id === poi.inventory_id) || { sku: 'SKU-101', name: 'ARM Cortex M4' };
      return {
        ...poi,
        item_sku: invItem.sku,
        item_name: invItem.name
      };
    });

    return {
      ...po,
      supplier_name: supplier.name,
      items
    };
  });

  res.json({
    total: enrichedOrders.length,
    purchase_orders: enrichedOrders
  });
});

// POST /api/purchase-orders - Create purchase order
router.post('/', (req, res) => {
  const { supplier_id, items, notes } = req.body;
  if (!supplier_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: true, message: 'Supplier ID and at least one item are required.' });
  }

  const newPoId = `po_${Date.now()}`;
  const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  let totalAmount = 0;
  const createdPoItems = [];

  items.forEach(item => {
    const subtotal = (item.quantity || 100) * (item.unit_price || 10.00);
    totalAmount += subtotal;

    const poItem = {
      id: `poi_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      po_id: newPoId,
      inventory_id: item.inventory_id || 'inv_101',
      quantity: item.quantity || 100,
      unit_price: item.unit_price || 10.00,
      subtotal: subtotal
    };
    createdPoItems.push(poItem);
    memoryDb.po_items.push(poItem);
  });

  const newPO = {
    id: newPoId,
    tenant_id: req.tenantId,
    supplier_id,
    po_number: poNumber,
    status: 'PENDING',
    total_amount: Number(totalAmount.toFixed(2)),
    notes: notes || 'Standard reorder',
    created_at: new Date().toISOString()
  };

  memoryDb.purchase_orders.unshift(newPO);

  res.status(201).json({
    message: 'Purchase order created successfully.',
    purchase_order: newPO,
    items: createdPoItems
  });
});

// PATCH /api/purchase-orders/:id - Update status or notes
router.patch('/:id', (req, res) => {
  const poIndex = memoryDb.purchase_orders.findIndex(po => po.id === req.params.id && po.tenant_id === req.tenantId);
  if (poIndex === -1) {
    return res.status(404).json({ error: true, message: 'Purchase order not found.' });
  }

  const po = memoryDb.purchase_orders[poIndex];
  if (req.body.status) po.status = req.body.status;
  if (req.body.notes) po.notes = req.body.notes;

  res.json({
    message: 'Purchase order updated successfully.',
    purchase_order: po
  });
});

// DELETE /api/purchase-orders/:id - Delete PO
router.delete('/:id', (req, res) => {
  const index = memoryDb.purchase_orders.findIndex(po => po.id === req.params.id && po.tenant_id === req.tenantId);
  if (index === -1) {
    return res.status(404).json({ error: true, message: 'Purchase order not found.' });
  }

  const deletedPo = memoryDb.purchase_orders.splice(index, 1)[0];
  memoryDb.po_items = memoryDb.po_items.filter(poi => poi.po_id !== req.params.id);

  res.json({
    message: 'Purchase order deleted successfully.',
    purchase_order: deletedPo
  });
});

module.exports = router;
