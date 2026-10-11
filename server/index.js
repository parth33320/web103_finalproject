const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const inventoryRoutes = require('./routes/inventory');
const supplierRoutes = require('./routes/suppliers');
const poRoutes = require('./routes/purchaseOrders');
const tenantRoutes = require('./routes/tenant');
const authRoutes = require('./routes/auth');
const resetRoutes = require('./routes/reset');
const errorHandler = require('./middleware/errorHandler');

app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', poRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reset', resetRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'SupplyAgent (Sovereign Supply Chain Orchestrator)',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production' || require('fs').existsSync(path.join(__dirname, '../client/dist'))) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[SupplyAgent Server] Running on http://localhost:${PORT}`);
});
