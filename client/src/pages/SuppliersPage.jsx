import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { Building2, Star, Clock, Mail, Plus, Award } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SuppliersPage() {
  const { activeTenant } = useTenant();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, [activeTenant]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/suppliers', {
        headers: { 'X-Tenant-ID': activeTenant }
      });
      const data = await res.json();
      setSuppliers(data.suppliers || []);
    } catch (err) {
      toast.error('Failed to load suppliers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Suppliers & Vendor Network
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Scoped: {activeTenant}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Relational supplier entity directory (1:M Suppliers to POs, M:M Inventory to Suppliers via `inventory_suppliers`).
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading supplier network...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{sup.name}</h3>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {sup.email}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {sup.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400" /> Vendor Rating
                  </div>
                  <div className="text-sm font-bold text-amber-400 font-mono mt-1">
                    {sup.rating} / 5.0
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Average Lead Time
                  </div>
                  <div className="text-sm font-bold text-cyan-300 font-mono mt-1">
                    {sup.lead_time_days} Days
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
