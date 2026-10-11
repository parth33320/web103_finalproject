import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, Zap, Building2, Package, Clock, DollarSign, Tag, Award } from 'lucide-react';
import { useTenant } from '../context/TenantContext';
import { toast } from 'react-toastify';

export default function SlideOutPane({ isOpen, onClose, itemId, onEdit, onDelete, onItemUpdated }) {
  const { activeTenant } = useTenant();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [clickedButton, setClickedButton] = useState(false);

  useEffect(() => {
    if (isOpen && itemId) {
      fetchItemDetails(itemId);
    }
  }, [isOpen, itemId, activeTenant]);

  const fetchItemDetails = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        headers: { 'X-Tenant-ID': activeTenant }
      });
      const data = await res.json();
      if (data.item) {
        setDetails(data);
      }
    } catch (err) {
      toast.error('Failed to load item details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateStockout = async () => {
    if (clickedButton || actionLoading) return;
    setClickedButton(true);
    setActionLoading(true);

    try {
      const res = await fetch(`/api/inventory/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': activeTenant
        },
        body: JSON.stringify({ quantity: 0 })
      });
      const data = await res.json();
      if (res.ok) {
        toast.warn(`Stockout triggered! Automatic Purchase Order ${data.poTriggered?.purchaseOrder?.po_number || ''} generated in PostgreSQL.`);
        fetchItemDetails(itemId);
        if (onItemUpdated) onItemUpdated();
      }
    } catch (err) {
      toast.error('Stockout trigger failed.');
    } finally {
      setActionLoading(false);
      setTimeout(() => setClickedButton(false), 1200);
    }
  };

  if (!isOpen) return null;

  const item = details?.item;
  const suppliers = details?.suppliers || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">Item Detailed Inspection</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading relational item data...</p>
            </div>
          ) : item ? (
            <div className="mt-6 space-y-6">
              {/* Product Image & Key Specs */}
              <div className="flex items-start space-x-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover border border-slate-800 bg-slate-950 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {item.sku}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.category}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      item.quantity === 0
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : item.quantity <= item.reorder_point
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {item.quantity === 0 ? 'STOCKOUT' : `${item.quantity} units in stock`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing & Reorder Specs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Spot Rate / Unit Price
                  </div>
                  <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">
                    ${Number(item.spot_rate).toFixed(2)}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    Reorder Threshold
                  </div>
                  <div className="text-lg font-bold text-cyan-300 mt-1 font-mono">
                    {item.reorder_point} units
                  </div>
                </div>
              </div>

              {/* Connected Suppliers (M:M Join Table `inventory_suppliers`) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    Connected Suppliers (M:M Junction)
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {suppliers.length} Vendors Linked
                  </span>
                </div>

                <div className="space-y-2">
                  {suppliers.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {s.name}
                          {s.is_primary && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-0.5">
                              <Award className="w-2.5 h-2.5 text-cyan-400" /> Primary
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{s.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-emerald-400 font-semibold">
                          ${Number(s.unit_cost || item.spot_rate).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {s.supplier_lead_time || 3}d lead
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Stockout PO Trigger Button */}
              <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-2">
                <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Test Automated PO Generation
                </div>
                <p className="text-[11px] text-slate-400">
                  Simulate stock depletion to 0 to trigger automatic Purchase Order generation and A2A supplier negotiation in PostgreSQL.
                </p>
                <button
                  onClick={handleSimulateStockout}
                  disabled={actionLoading || clickedButton || item.quantity === 0}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                    item.quantity === 0 || clickedButton || actionLoading
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-amber-600 text-slate-950 hover:bg-amber-500 shadow-md'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{actionLoading ? 'Processing PO Automation...' : item.quantity === 0 ? 'Stockout Active (PO Created)' : 'Simulate Stockout (Qty = 0)'}</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        {item && (
          <div className="pt-4 border-t border-slate-800 flex items-center space-x-3">
            <button
              onClick={() => onEdit(item)}
              className="flex-1 py-2 px-4 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Item</span>
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="py-2 px-4 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
