const { memoryDb } = require('../db');

function triggerStockoutPOAutomation(item, tenantId) {
  if (!item || item.quantity !== 0) return null;

  console.log(`[PO Automation] Stockout detected for item ${item.sku} (${item.name}). Initiating automated PO generation...`);

  // Find primary supplier for this item from inventory_suppliers join table
  const invSupplierRel = memoryDb.inventory_suppliers.find(is => is.inventory_id === item.id && is.is_primary) ||
                          memoryDb.inventory_suppliers.find(is => is.inventory_id === item.id) || {
                            supplier_id: 'sup_01',
                            unit_cost: item.spot_rate || 10.00,
                            supplier_lead_time: 3
                          };

  const supplier = memoryDb.suppliers.find(s => s.id === invSupplierRel.supplier_id) || {
    id: 'sup_01',
    name: 'Apex Electronics',
    email: 'orders@apexelectronics.com'
  };

  // Reorder quantity based on reorder point * 3 or default 100
  const reorderQty = (item.reorder_point || 20) * 5;
  const unitPrice = invSupplierRel.unit_cost || item.spot_rate || 10.00;
  const totalAmount = reorderQty * unitPrice;

  const newPoId = `po_${Date.now()}`;
  const poNumber = `PO-AUTO-${Math.floor(1000 + Math.random() * 9000)}`;

  const newPO = {
    id: newPoId,
    tenant_id: tenantId,
    supplier_id: supplier.id,
    po_number: poNumber,
    status: 'APPROVED', // Automated stockout replenishment PO
    total_amount: totalAmount,
    notes: `Automated Stockout PO for ${item.sku} (${item.name}). Triggered at Qty=0.`,
    created_at: new Date().toISOString()
  };

  memoryDb.purchase_orders.unshift(newPO);

  const poItem = {
    id: `poi_${Date.now()}`,
    po_id: newPoId,
    inventory_id: item.id,
    quantity: reorderQty,
    unit_price: unitPrice,
    subtotal: totalAmount
  };

  memoryDb.po_items.unshift(poItem);

  // Record A2A negotiation log
  const negotiation = {
    id: `neg_${Date.now()}`,
    tenant_id: tenantId,
    sku: item.sku,
    item_name: item.name,
    supplier_name: supplier.name,
    status: 'COMPLETED',
    offered_unit_price: unitPrice,
    lead_time_days: invSupplierRel.supplier_lead_time || 3,
    restock_quantity: reorderQty,
    created_at: new Date().toISOString()
  };

  memoryDb.a2a_negotiations.unshift(negotiation);

  return {
    autoPoTriggered: true,
    purchaseOrder: newPO,
    negotiation: negotiation
  };
}

module.exports = {
  triggerStockoutPOAutomation
};
