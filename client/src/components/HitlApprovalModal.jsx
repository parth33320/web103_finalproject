import React, { useState } from 'react';
import { CheckCircle, XCircle, ShieldCheck, ShoppingBag, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

export default function HitlApprovalModal({ isOpen, onClose, negotiationData, onApproved }) {
  const [approving, setApproving] = useState(false);
  const [clicked, setClicked] = useState(false);

  if (!isOpen || !negotiationData) return null;

  const handleApprove = async () => {
    if (clicked || approving) return;
    setClicked(true);
    setApproving(true);

    try {
      // Create PO from approved quote
      const res = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier_id: negotiationData.supplier_id || 'sup_01',
          items: [{
            inventory_id: 'inv_101',
            quantity: negotiationData.requested_quantity || 100,
            unit_price: negotiationData.negotiated_unit_price || 11.50
          }],
          notes: `HITL Approved Quote for SKU: ${negotiationData.sku}`
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Purchase Order ${data.purchase_order.po_number} generated and persisted in PostgreSQL!`);
        if (onApproved) onApproved();
        onClose();
      }
    } catch (err) {
      toast.error('Failed to create purchase order.');
    } finally {
      setApproving(false);
      setTimeout(() => setClicked(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Human-in-the-Loop (HITL) Procurement Checkpoint</h3>
            <p className="text-xs text-slate-400">A2A Negotiation Approval & PO Dispatch</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Target Stockout SKU:</span>
            <span className="font-mono text-cyan-400 font-bold">{negotiationData.sku}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Item Description:</span>
            <span className="text-slate-200 font-medium">{negotiationData.item_name}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Recommended Supplier:</span>
            <span className="text-white font-semibold">{negotiationData.supplier_name}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Negotiated Unit Price:</span>
            <span className="text-emerald-400 font-mono font-bold">${negotiationData.negotiated_unit_price} (-7% Discount)</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Restock Quantity:</span>
            <span className="font-mono text-slate-200">{negotiationData.requested_quantity || 100} units</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Estimated Lead Time:</span>
            <span className="flex items-center gap-1 text-cyan-300"><Clock className="w-3 h-3" /> {negotiationData.lead_time_days || 3} Business Days</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
            <span className="font-bold text-slate-200">Total Purchase Commitment:</span>
            <span className="font-mono font-bold text-emerald-400">${negotiationData.total_quote?.toLocaleString()} USD</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={approving || clicked}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Reject Quote</span>
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={approving || clicked}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center space-x-2 transition-all ${
              approving || clicked
                ? 'bg-emerald-800 opacity-60 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-md'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{approving ? 'Generating PO...' : 'Approve & Create PO'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
