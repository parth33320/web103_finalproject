import React, { useState, useEffect } from 'react';
import { X, Upload, Save, AlertCircle } from 'lucide-react';
import { useTenant } from '../context/TenantContext';
import { toast } from 'react-toastify';

export default function EditItemModal({ isOpen, onClose, initialData, onSaveSuccess }) {
  const { activeTenant } = useTenant();
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Semiconductors',
    quantity: 50,
    reorder_point: 15,
    spot_rate: 12.50,
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
  });

  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        sku: initialData.sku || '',
        name: initialData.name || '',
        category: initialData.category || 'Semiconductors',
        quantity: initialData.quantity !== undefined ? initialData.quantity : 50,
        reorder_point: initialData.reorder_point || 15,
        spot_rate: initialData.spot_rate || 12.50,
        image_url: initialData.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      });
    } else {
      setFormData({
        sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        category: 'Semiconductors',
        quantity: 50,
        reorder_point: 15,
        spot_rate: 12.50,
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
      });
    }
    setValidationError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Cloud Service Image Upload simulation
  const handleCloudImageUpload = () => {
    setUploadingImage(true);
    setTimeout(() => {
      const sampleCloudImages = [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'
      ];
      const randomCloudUrl = sampleCloudImages[Math.floor(Math.random() * sampleCloudImages.length)];
      setFormData((prev) => ({ ...prev, image_url: randomCloudUrl }));
      setUploadingImage(false);
      toast.success('Image successfully uploaded to Cloudinary service!');
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (clicked || loading) return;

    // Client-side payload validation
    if (!formData.sku || formData.sku.trim() === '') {
      setValidationError('SKU is required.');
      return;
    }
    if (!formData.name || formData.name.trim() === '') {
      setValidationError('Item Name is required.');
      return;
    }
    if (Number(formData.quantity) < 0) {
      setValidationError('Quantity cannot be negative.');
      return;
    }
    if (Number(formData.spot_rate) < 0) {
      setValidationError('Spot rate cannot be negative.');
      return;
    }

    setClicked(true);
    setLoading(true);
    setValidationError('');

    const isEdit = Boolean(initialData?.id);
    const url = isEdit ? `/api/inventory/${initialData.id}` : '/api/inventory';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': activeTenant
        },
        body: JSON.stringify({
          sku: formData.sku,
          name: formData.name,
          category: formData.category,
          quantity: Number(formData.quantity),
          reorder_point: Number(formData.reorder_point),
          spot_rate: Number(formData.spot_rate),
          image_url: formData.image_url
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setValidationError(data.message || 'Validation Error.');
        toast.error(data.message || 'Error updating item.');
      } else {
        toast.success(isEdit ? 'Inventory item updated!' : 'New inventory item created!');
        if (onSaveSuccess) onSaveSuccess();
        onClose();
      }
    } catch (err) {
      toast.error('Network request error.');
    } finally {
      setLoading(false);
      setTimeout(() => setClicked(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">
            {initialData ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {validationError && (
          <div className="mt-4 p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl flex items-center space-x-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">SKU Code</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              disabled={loading || clicked}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading || clicked}
              placeholder="e.g., ARM Cortex Microcontroller"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading || clicked}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
              >
                <option value="Semiconductors">Semiconductors</option>
                <option value="Connectors">Connectors</option>
                <option value="Optoelectronics">Optoelectronics</option>
                <option value="Processors">Processors</option>
                <option value="AI Accelerators">AI Accelerators</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                disabled={loading || clicked}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Reorder Point</label>
              <input
                type="number"
                name="reorder_point"
                value={formData.reorder_point}
                onChange={handleChange}
                disabled={loading || clicked}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Spot Rate ($)</label>
              <input
                type="number"
                step="0.01"
                name="spot_rate"
                value={formData.spot_rate}
                onChange={handleChange}
                disabled={loading || clicked}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-50"
              />
            </div>
          </div>

          {/* Cloud Image Upload */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Cloud Image Upload</label>
            <div className="flex items-center space-x-3">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-10 h-10 rounded-lg object-cover border border-slate-800 bg-slate-950 shrink-0"
              />
              <button
                type="button"
                onClick={handleCloudImageUpload}
                disabled={uploadingImage || loading || clicked}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? 'Uploading to Cloud...' : 'Upload Cloud Image'}</span>
              </button>
            </div>
          </div>

          {/* Form Submit Button */}
          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || clicked}
              className="py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || clicked}
              className={`py-2 px-5 rounded-lg text-white font-bold flex items-center space-x-2 transition-all ${
                loading || clicked
                  ? 'bg-cyan-800 opacity-60 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 shadow-md'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving Payload...' : 'Save Mutation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
