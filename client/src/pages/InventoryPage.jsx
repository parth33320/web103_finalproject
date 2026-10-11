import React, { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { Search, Filter, ArrowUpDown, Plus, Eye, Edit, Trash2, Zap, Cloud } from 'lucide-react';
import SlideOutPane from '../components/SlideOutPane';
import EditItemModal from '../components/EditItemModal';
import { toast } from 'react-toastify';

export default function InventoryPage() {
  const { activeTenant } = useTenant();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sort, setSort] = useState('none');

  // Modal & SlideOut Pane State
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isPaneOpen, setIsPaneOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItemData, setEditItemData] = useState(null);

  // Button disabling during click
  const [disabledButtons, setDisabledButtons] = useState({});

  useEffect(() => {
    fetchInventory();
  }, [activeTenant, category, sort]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      let url = `/api/inventory?category=${category}&sort=${sort}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url, {
        headers: { 'X-Tenant-ID': activeTenant }
      });
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      toast.error('Failed to load inventory list.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInventory();
  };

  const handleInspect = (id) => {
    setSelectedItemId(id);
    setIsPaneOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditItemData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditItemData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (disabledButtons[id]) return;

    setDisabledButtons(prev => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
        headers: { 'X-Tenant-ID': activeTenant }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Deleted item ${data.item?.sku || ''}`);
        if (isPaneOpen) setIsPaneOpen(false);
        fetchInventory();
      }
    } catch (err) {
      toast.error('Failed to delete item.');
    } finally {
      setTimeout(() => {
        setDisabledButtons(prev => ({ ...prev, [id]: false }));
      }, 1000);
    }
  };

  // Filter local items by search term for instant feedback
  const filteredItems = items.filter(item => {
    if (!search) return true;
    return item.name.toLowerCase().includes(search.toLowerCase()) ||
           item.sku.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Multi-Tenant Inventory & Stock Orchestration
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Scoped: {activeTenant}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time PostgreSQL relational inventory table with instant search, filtering, and stockout triggers.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Stock SKU</span>
        </button>
      </div>

      {/* Controls Bar: Search, Category Filter, Sort */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search SKU or item name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </form>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {/* Category Filter */}
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Categories</option>
              <option value="Semiconductors" className="bg-slate-900">Semiconductors</option>
              <option value="Connectors" className="bg-slate-900">Connectors</option>
              <option value="Optoelectronics" className="bg-slate-900">Optoelectronics</option>
              <option value="Processors" className="bg-slate-900">Processors</option>
              <option value="AI Accelerators" className="bg-slate-900">AI Accelerators</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="none" className="bg-slate-900">Default</option>
              <option value="quantity_asc" className="bg-slate-900">Qty: Low to High</option>
              <option value="quantity_desc" className="bg-slate-900">Qty: High to Low</option>
              <option value="rate_asc" className="bg-slate-900">Price: Low to High</option>
              <option value="rate_desc" className="bg-slate-900">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Fetching inventory from PostgreSQL database...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-400">No inventory items match active criteria.</p>
            <p className="text-xs text-slate-500">Try adjusting your category filter or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Item Details</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Quantity / Status</th>
                  <th className="py-3.5 px-4">Spot Rate</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-9 h-9 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-[10px] text-slate-500">Reorder point: {item.reorder_point}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-400 font-semibold">{item.sku}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.quantity === 0
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : item.quantity <= item.reorder_point
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}
                        >
                          {item.quantity === 0 ? 'STOCKOUT' : `${item.quantity} units`}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      ${Number(item.spot_rate).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleInspect(item.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                          title="Inspect Details (Slide-out Pane)"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Edit Item"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={disabledButtons[item.id]}
                          className={`p-1.5 rounded-lg text-rose-400 transition-colors ${
                            disabledButtons[item.id]
                              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                              : 'bg-slate-800 hover:bg-rose-950'
                          }`}
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-out Inspection Pane */}
      <SlideOutPane
        isOpen={isPaneOpen}
        onClose={() => setIsPaneOpen(false)}
        itemId={selectedItemId}
        onEdit={(item) => {
          setIsPaneOpen(false);
          handleOpenEditModal(item);
        }}
        onDelete={(id) => {
          handleDelete(id);
        }}
        onItemUpdated={fetchInventory}
      />

      {/* Create / Edit Modal */}
      <EditItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editItemData}
        onSaveSuccess={fetchInventory}
      />
    </div>
  );
}
