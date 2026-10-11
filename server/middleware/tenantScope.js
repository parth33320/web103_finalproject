const { memoryDb } = require('../db');

function tenantScope(req, res, next) {
  // Read tenant ID from X-Tenant-ID header or query string
  const tenantIdHeader = req.headers['x-tenant-id'] || req.query.tenant_id || 'tenant_01';

  req.tenantId = tenantIdHeader;

  // Find tenant settings for 1:1 relationship
  const settings = memoryDb.tenant_settings.find(s => s.tenant_id === req.tenantId) || {
    tenant_id: req.tenantId,
    budget_limit: 50000,
    auto_po_enabled: true,
    preferred_currency: 'USD',
    low_stock_threshold: 15
  };

  req.tenantSettings = settings;
  next();
}

module.exports = tenantScope;
