const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

let pool = null;
let isPgConnected = false;

// In-Memory Database fallback for local dev/testing if PostgreSQL URL is not available
class InMemoryDB {
  constructor() {
    this.reset();
  }

  reset() {
    this.tenants = [
      { id: 'tenant_01', name: 'Acme Corp', slug: 'acme', created_at: new Date().toISOString() },
      { id: 'tenant_02', name: 'Stark Tech', slug: 'stark', created_at: new Date().toISOString() },
      { id: 'tenant_03', name: 'Cyberdyne Systems', slug: 'cyberdyne', created_at: new Date().toISOString() }
    ];

    this.tenant_settings = [
      { id: 'ts_01', tenant_id: 'tenant_01', budget_limit: 50000, auto_po_enabled: true, preferred_currency: 'USD', low_stock_threshold: 15, updated_at: new Date().toISOString() },
      { id: 'ts_02', tenant_id: 'tenant_02', budget_limit: 150000, auto_po_enabled: true, preferred_currency: 'USD', low_stock_threshold: 25, updated_at: new Date().toISOString() },
      { id: 'ts_03', tenant_id: 'tenant_03', budget_limit: 250000, auto_po_enabled: false, preferred_currency: 'EUR', low_stock_threshold: 10, updated_at: new Date().toISOString() }
    ];

    this.suppliers = [
      { id: 'sup_01', tenant_id: 'tenant_01', name: 'Apex Electronics', email: 'orders@apexelectronics.com', rating: 4.8, lead_time_days: 3, created_at: new Date().toISOString() },
      { id: 'sup_02', tenant_id: 'tenant_01', name: 'Zenith Logistics', email: 'sales@zenithlogistics.io', rating: 4.5, lead_time_days: 5, created_at: new Date().toISOString() },
      { id: 'sup_03', tenant_id: 'tenant_02', name: 'Global Components', email: 'supply@globalcomponents.com', rating: 4.9, lead_time_days: 2, created_at: new Date().toISOString() },
      { id: 'sup_04', tenant_id: 'tenant_03', name: 'Semicon Inc', email: 'b2b@semicon.com', rating: 4.2, lead_time_days: 7, created_at: new Date().toISOString() }
    ];

    this.inventory = [
      {
        id: 'inv_101',
        tenant_id: 'tenant_01',
        sku: 'SKU-101',
        name: 'ARM Cortex M4 Microcontroller',
        category: 'Semiconductors',
        quantity: 45,
        reorder_point: 20,
        spot_rate: 11.80,
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'inv_102',
        tenant_id: 'tenant_01',
        sku: 'SKU-102',
        name: 'High-Speed USB-C Transceiver',
        category: 'Connectors',
        quantity: 120,
        reorder_point: 30,
        spot_rate: 1.20,
        image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'inv_103',
        tenant_id: 'tenant_01',
        sku: 'SKU-103',
        name: 'Optocoupler Isolation Module',
        category: 'Optoelectronics',
        quantity: 10,
        reorder_point: 15,
        spot_rate: 4.50,
        image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'inv_201',
        tenant_id: 'tenant_02',
        sku: 'SKU-201',
        name: 'Vibranium-Alloy Core Processor',
        category: 'Processors',
        quantity: 200,
        reorder_point: 50,
        spot_rate: 850.00,
        image_url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'inv_301',
        tenant_id: 'tenant_03',
        sku: 'SKU-301',
        name: 'Neural Network Processing Chip',
        category: 'AI Accelerators',
        quantity: 50,
        reorder_point: 15,
        spot_rate: 1200.00,
        image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    this.inventory_suppliers = [
      { id: 'is_01', inventory_id: 'inv_101', supplier_id: 'sup_01', unit_cost: 11.50, is_primary: true, supplier_lead_time: 3 },
      { id: 'is_02', inventory_id: 'inv_101', supplier_id: 'sup_02', unit_cost: 12.10, is_primary: false, supplier_lead_time: 5 },
      { id: 'is_03', inventory_id: 'inv_102', supplier_id: 'sup_01', unit_cost: 1.15, is_primary: true, supplier_lead_time: 3 },
      { id: 'is_04', inventory_id: 'inv_201', supplier_id: 'sup_03', unit_cost: 820.00, is_primary: true, supplier_lead_time: 2 },
      { id: 'is_05', inventory_id: 'inv_301', supplier_id: 'sup_04', unit_cost: 1150.00, is_primary: true, supplier_lead_time: 7 }
    ];

    this.purchase_orders = [
      {
        id: 'po_1001',
        tenant_id: 'tenant_01',
        supplier_id: 'sup_01',
        po_number: 'PO-2026-001',
        status: 'APPROVED',
        total_amount: 1150.00,
        notes: 'Initial stocking batch',
        created_at: new Date().toISOString()
      },
      {
        id: 'po_1002',
        tenant_id: 'tenant_01',
        supplier_id: 'sup_02',
        po_number: 'PO-2026-002',
        status: 'PENDING',
        total_amount: 605.00,
        notes: 'Buffer reserve order',
        created_at: new Date().toISOString()
      }
    ];

    this.po_items = [
      { id: 'poi_01', po_id: 'po_1001', inventory_id: 'inv_101', quantity: 100, unit_price: 11.50, subtotal: 1150.00 },
      { id: 'poi_02', po_id: 'po_1002', inventory_id: 'inv_102', quantity: 500, unit_price: 1.21, subtotal: 605.00 }
    ];

    this.a2a_negotiations = [];
  }
}

const memoryDb = new InMemoryDB();

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    isPgConnected = true;
  } catch (err) {
    console.warn('PostgreSQL Pool initialization failed, falling back to in-memory store:', err.message);
    isPgConnected = false;
  }
}

async function query(text, params = []) {
  if (isPgConnected && pool) {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (err) {
      console.warn('PostgreSQL query error, falling back to memory execution:', err.message);
    }
  }

  // Fallback query execution against memory store
  const sql = text.trim();

  // Reset API call
  if (sql.toLowerCase().includes('reset') || sql.toLowerCase().includes('delete from')) {
    memoryDb.reset();
    return { rows: [{ message: 'Database reset successfully' }] };
  }

  return { rows: [] };
}

module.exports = {
  query,
  memoryDb,
  isPgConnected: () => isPgConnected
};
