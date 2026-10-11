import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { Package, AlertTriangle, ShoppingCart, DollarSign, ArrowRight, Zap, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { activeTenant, tenantSettings } = useTenant();
  const [metrics, setMetrics] = useState({
    totalInventory: 0,
    lowStockCount: 0,
    stockoutCount: 0,
    activeOrdersCount: 0,
    totalValuation: 0
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTenant]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory', {
        headers: { 'X-Tenant-ID': activeTenant }
      });
      const data = await res.json();
      const inventory = data.items || [];

      const lowStock = inventory.filter(i => i.quantity <= i.reorder_point && i.quantity > 0);
      const stockouts = inventory.filter(i => i.quantity === 0);
      const valuation = inventory.reduce((acc, i) => acc + (i.quantity * i.spot_rate), 0);

      const poRes = await fetch('/api/purchase-orders', {
        headers: { 'X-Tenant-ID': activeTenant }
      });
      const poData = await poRes.json();

      setItems(inventory);
      setMetrics({
        totalInventory: inventory.length,
        lowStockCount: lowStock.length,
        stockoutCount: stockouts.length,
        activeOrdersCount: (poData.purchase_orders || []).length,
        totalValuation: valuation
      });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            Tenant Scope: {activeTenant}
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Autonomous Supply Chain Dashboard</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-tenant monitoring, stockout detection, and A2A automated reordering.
          </p>
        </div>
        <Link
          to="/inventory"
          className="py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shrink-0"
        >
          <span>Manage Inventory</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Total SKUs Tracked</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{metrics.totalInventory}</div>
          <p className="text-[10px] text-slate-500">PostgreSQL Relational DB</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Stockouts / Zero Stock</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">{metrics.stockoutCount}</div>
          <p className="text-[10px] text-rose-400/80">Auto PO Trigger Condition</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Active Purchase Orders</span>
            <ShoppingCart className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{metrics.activeOrdersCount}</div>
          <p className="text-[10px] text-slate-500">1:M Tenant to POs</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Inventory Valuation</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            ${metrics.totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-slate-500">Budget Limit: ${tenantSettings.budget_limit?.toLocaleString()}</p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Low Stock / Stockout Attention Items */}
        <div className="lg:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Priority Inventory Watchlist
            </h3>
            <span className="text-xs text-slate-400 font-mono">Scoped: {activeTenant}</span>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading metrics...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        {item.name}
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {item.sku}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Category: {item.category}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-emerald-400">
                      ${Number(item.spot_rate).toFixed(2)}
                    </div>
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded mt-1 ${
                        item.quantity === 0
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : item.quantity <= item.reorder_point
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {item.quantity === 0 ? 'STOCKOUT (Auto PO)' : `${item.quantity} in stock`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Tenant 1:1 Configuration Summary */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Tenant 1:1 Profile
            </h3>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Active Tenant ID:</span>
              <span className="font-mono text-cyan-400 font-semibold">{activeTenant}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Max Budget Cap:</span>
              <span className="font-mono text-white">${tenantSettings.budget_limit?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Currency Preference:</span>
              <span className="font-mono text-slate-200">{tenantSettings.preferred_currency}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Automated PO Generator:</span>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
          </div>

          <Link
            to="/settings"
            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors border border-slate-700"
          >
            <span>Update Tenant Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
