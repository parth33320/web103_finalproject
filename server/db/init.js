const { memoryDb } = require('./index');

console.log('[DB Init] Initializing and seeding SupplyAgent PostgreSQL / Memory database...');
memoryDb.reset();
console.log(`[DB Init] Database seeded with ${memoryDb.tenants.length} tenants, ${memoryDb.inventory.length} inventory items, ${memoryDb.suppliers.length} suppliers, and ${memoryDb.purchase_orders.length} purchase orders.`);
console.log('[DB Init] Database initialization complete.');
