import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { ShoppingCart, Zap, Clock, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import HitlApprovalModal from '../components/HitlApprovalModal';
import { toast } from 'react-toastify';

export default function PurchaseOrdersPage() {
  const { activeTenant } = useTenant();
  const [orders, setOrders] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'negotiations'

  // HITL Approval Modal
  const [selectedNegotiation, setSelectedNegotiation] = useState(null);
  const [isHitlOpen, setIsHitlOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTenant]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/purchase-orders', {
        headers: { 'X-Tenant-ID': activeTenant }
      });
      const data = await res.json();
      setOrders(data.purchase_orders || []);

      // Mock live A2A negotiations list
      setNegotiations([
        {
          id: 'neg_101',
          tenant_id: activeTenant,
          sku: 'SKU-101',
          item_name: 'ARM Cortex M4 Microcontroller',
          supplier_name: 'Apex Electronics',
          supplier_id: 'sup_01',
          requested_quantity: 100,
          original_target_price: 12.50,
          negotiated_unit_price: 11.50,
          discount_percentage: '7%',
          lead_time_days: 3,
          total_quote: 1150.00,
          status: 'REQUIRES_HITL'
        },
        {
          id: 'neg_102',
          tenant_id: activeTenant,
          sku: 'SKU-102',
          item_name: 'High-Speed USB-C Transceiver',
          supplier_name: 'Zenith Logistics',
          supplier_id: 'sup_02',
          requested_quantity: 500,
          original_target_price: 1.30,
          negotiated_unit_price: 1.21,
          discount_percentage: '7%',
          lead_time_days: 5,
          total_quote: 605.00,
          status: 'COMPLETED'
        }
      ]);
    } catch (err) {
      toast.error('Failed to load purchase orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenHitl = (neg) => {
    setSelectedNegotiation(neg);
    setIsHitlOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Purchase Orders & A2A Negotiations
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Scoped: {activeTenant}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Automated stockout replenishment, supplier quote negotiations, and Human-in-the-Loop review.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'orders'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Persisted Purchase Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('negotiations')}
          className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'negotiations'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>A2A Supplier Negotiations ({negotiations.length})</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading purchase orders...</p>
        </div>
      ) : activeTab === 'orders' ? (
        /* Purchase Orders Table */
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">PO Number</th>
                  <th className="py-3.5 px-4">Supplier</th>
                  <th className="py-3.5 px-4">Items / SKUs</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Date Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      {po.po_number}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">{po.supplier_name}</td>
                    <td className="py-3.5 px-4">
                      {po.items?.map((item, idx) => (
                        <div key={idx} className="text-slate-300">
                          <span className="font-mono text-cyan-400">{item.item_sku}</span> ({item.quantity} units @ ${item.unit_price})
                        </div>
                      )) || <span className="text-slate-500">100 units</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      ${Number(po.total_amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          po.status === 'APPROVED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : po.status === 'PENDING'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                      {new Date(po.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* A2A Supplier Negotiations Cards */
        <div className="space-y-4">
          {negotiations.map((neg) => (
            <div
              key={neg.id}
              className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    SKU: {neg.sku}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">{neg.item_name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> A2A Quote Negotiated
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Supplier Vendor</div>
                  <div className="font-bold text-white mt-0.5">{neg.supplier_name}</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Negotiated Unit Price</div>
                  <div className="font-bold text-emerald-400 font-mono mt-0.5">
                    ${neg.negotiated_unit_price} <span className="text-[10px] text-slate-500">(-7% discount)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Total Commitment</div>
                  <div className="font-bold text-cyan-300 font-mono mt-0.5">
                    ${neg.total_quote?.toLocaleString()} USD
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleOpenHitl(neg)}
                  className="py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Review Quote (HITL Checkpoint)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HITL Review Modal */}
      <HitlApprovalModal
        isOpen={isHitlOpen}
        onClose={() => setIsHitlOpen(false)}
        negotiationData={selectedNegotiation}
        onApproved={fetchData}
      />
    </div>
  );
}
