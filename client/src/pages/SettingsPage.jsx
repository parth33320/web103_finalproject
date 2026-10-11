import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { Building2, Save, RefreshCw, Shield, DollarSign, Zap } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SettingsPage() {
  const { activeTenant, tenantSettings, setTenantSettings, fetchTenantSettings } = useTenant();
  const [formData, setFormData] = useState({
    budget_limit: 50000,
    auto_po_enabled: true,
    preferred_currency: 'USD',
    low_stock_threshold: 15
  });

  const [saving, setSaving] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (tenantSettings) {
      setFormData({
        budget_limit: tenantSettings.budget_limit || 50000,
        auto_po_enabled: tenantSettings.auto_po_enabled !== undefined ? tenantSettings.auto_po_enabled : true,
        preferred_currency: tenantSettings.preferred_currency || 'USD',
        low_stock_threshold: tenantSettings.low_stock_threshold || 15
      });
    }
  }, [tenantSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (clicked || saving) return;
    setClicked(true);
    setSaving(true);

    try {
      const res = await fetch('/api/tenant/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': activeTenant
        },
        body: JSON.stringify({
          budget_limit: Number(formData.budget_limit),
          auto_po_enabled: formData.auto_po_enabled,
          preferred_currency: formData.preferred_currency,
          low_stock_threshold: Number(formData.low_stock_threshold)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setTenantSettings(data.settings);
        toast.success('Tenant configuration updated in 1:1 settings table!');
      }
    } catch (err) {
      toast.error('Failed to update tenant settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setClicked(false), 1000);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          Tenant Configuration & 1:1 Settings
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            Scoped: {activeTenant}
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Configure tenant-level parameters stored in 1:1 `tenant_settings` database relationship.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Active Tenant Profile Details</h3>
            <p className="text-xs text-slate-400">Tenant Identifier: {activeTenant}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Maximum Budget Limit ({formData.preferred_currency})
            </label>
            <input
              type="number"
              name="budget_limit"
              value={formData.budget_limit}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Preferred Currency</label>
              <select
                name="preferred_currency"
                value={formData.preferred_currency}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Low Stock Threshold</label>
              <input
                type="number"
                name="low_stock_threshold"
                value={formData.low_stock_threshold}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Automated PO Generation on Stockout
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically generate PO records in PostgreSQL when inventory hits zero quantity.
              </p>
            </div>
            <input
              type="checkbox"
              name="auto_po_enabled"
              checked={formData.auto_po_enabled}
              onChange={handleChange}
              className="w-5 h-5 accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving || clicked}
              className={`py-2.5 px-6 rounded-xl text-xs font-bold text-white flex items-center space-x-2 transition-all ${
                saving || clicked
                  ? 'bg-cyan-800 opacity-60 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 shadow-md'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating 1:1 Table...' : 'Save Tenant Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
