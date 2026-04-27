import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, Search, Eye, EyeOff, Image as ImageIcon, Check, AlertCircle, GripVertical } from 'lucide-react';
import MediaPicker from '../components/MediaPicker';

interface Product {
  id?: number;
  slug: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  long_description_en: string;
  long_description_fr: string;
  badge: string;
  cover_image_id: number | null;
  cover_url?: string;
  order_index: number;
  is_published: boolean;
}

const empty = (): Product => ({
  slug: '', name_en: '', name_fr: '', description_en: '', description_fr: '',
  long_description_en: '', long_description_fr: '', badge: '',
  cover_image_id: null, order_index: 0, is_published: true,
});

const makeSlug = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch { showToast('Failed to load products', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name_en || !editing.name_fr) {
      showToast('Name in both EN and FR is required', 'error'); return;
    }
    if (!editing.slug?.trim() && editing.name_en) {
      editing.slug = makeSlug(editing.name_en);
    }
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? '/api/products' : `/api/products/${editing.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(editing)
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      showToast(isNew ? 'Product created!' : 'Product updated!');
      setEditing(null);
      fetchProducts();
    } catch (e: any) { showToast(e.message || 'Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      showToast('Product deleted');
      setDeleteConfirm(null);
      fetchProducts();
    } catch { showToast('Delete failed', 'error'); }
  };

  const filtered = products.filter(p =>
    (p.name_en || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.name_fr || '').toLowerCase().includes(search.toLowerCase())
  );

  if (editing) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24 z-20">
          <button onClick={() => setEditing(null)} className="p-3 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
            <X size={20} />
          </button>
          <div className="flex-grow">
            <div className="text-[10px] font-black uppercase tracking-widest text-red-600">
              {editing.id ? 'Editing Product' : 'New Product'}
            </div>
            <h2 className="text-2xl font-serif italic text-gray-900">{editing.name_en || 'Untitled'}</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-100 hover:bg-red-700 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main fields */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Name (EN) *</label>
                  <input
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-lg font-serif italic outline-none focus:bg-white focus:border-red-400 transition-all"
                    value={editing.name_en}
                    onChange={e => {
                      const v = e.target.value;
                      setEditing(prev => prev ? { ...prev, name_en: v, slug: prev.slug || makeSlug(v) } : prev);
                    }}
                    placeholder="Product name in English"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Name (FR) *</label>
                  <input
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-lg font-serif italic outline-none focus:bg-white focus:border-red-400 transition-all"
                    value={editing.name_fr}
                    onChange={e => setEditing(prev => prev ? { ...prev, name_fr: e.target.value } : prev)}
                    placeholder="Nom du produit en français"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Short Description (EN)</label>
                  <textarea rows={3} className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-400 transition-all resize-none"
                    value={editing.description_en}
                    onChange={e => setEditing(prev => prev ? { ...prev, description_en: e.target.value } : prev)}
                    placeholder="Brief description..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Short Description (FR)</label>
                  <textarea rows={3} className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-400 transition-all resize-none"
                    value={editing.description_fr}
                    onChange={e => setEditing(prev => prev ? { ...prev, description_fr: e.target.value } : prev)}
                    placeholder="Description courte..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Long Description (EN)</label>
                  <textarea rows={5} className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-400 transition-all resize-none"
                    value={editing.long_description_en}
                    onChange={e => setEditing(prev => prev ? { ...prev, long_description_en: e.target.value } : prev)}
                    placeholder="Detailed description shown in product modal..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Long Description (FR)</label>
                  <textarea rows={5} className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-400 transition-all resize-none"
                    value={editing.long_description_fr}
                    onChange={e => setEditing(prev => prev ? { ...prev, long_description_fr: e.target.value } : prev)}
                    placeholder="Description détaillée affichée dans le modal..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-300 border-b border-gray-50 pb-3">Settings</h3>

              {/* Cover image */}
              <div>
                <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Cover Image</label>
                <div
                  onClick={() => setMediaPickerOpen(true)}
                  className="group relative aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden hover:border-red-200 transition-all"
                >
                  {editing.cover_image_id ? (
                    <img src={editing.cover_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="text-center group-hover:scale-110 transition-transform">
                      <ImageIcon size={28} className="text-gray-200 mx-auto mb-2" />
                      <span className="text-[10px] font-bold text-gray-300 uppercase">Select Image</span>
                    </div>
                  )}
                </div>
                {editing.cover_image_id && (
                  <button onClick={() => setEditing(prev => prev ? { ...prev, cover_image_id: null, cover_url: undefined } : prev)}
                    className="mt-2 text-[10px] text-red-400 hover:text-red-600 font-bold uppercase tracking-widest">
                    Remove image
                  </button>
                )}
              </div>

              {/* Badge */}
              <div>
                <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Badge (optional)</label>
                <input
                  className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-400 transition-all"
                  value={editing.badge}
                  onChange={e => setEditing(prev => prev ? { ...prev, badge: e.target.value } : prev)}
                  placeholder="e.g. UNESCO Heritage, PDO / AOC"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Slug</label>
                <input
                  className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm font-mono outline-none focus:bg-white focus:border-red-400 transition-all text-gray-500"
                  value={editing.slug}
                  onChange={e => setEditing(prev => prev ? { ...prev, slug: e.target.value } : prev)}
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Display Order</label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-400 transition-all"
                  value={editing.order_index}
                  onChange={e => setEditing(prev => prev ? { ...prev, order_index: parseInt(e.target.value) || 0 } : prev)}
                />
              </div>

              {/* Published toggle */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${editing.is_published ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                    {editing.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gray-400 mb-0.5">Status</div>
                    <div className="text-sm font-bold text-gray-900">{editing.is_published ? 'Published' : 'Draft'}</div>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(prev => prev ? { ...prev, is_published: !prev.is_published } : prev)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${editing.is_published ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editing.is_published ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <MediaPicker
          isOpen={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          selectedId={editing.cover_image_id}
          onSelect={(m) => {
            setEditing(prev => prev ? { ...prev, cover_image_id: m.id, cover_url: m.url } : prev);
            setMediaPickerOpen(false);
          }}
        />

        {toast && (
          <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] ${toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`}>
            {toast.type === 'success' ? <Check size={20} className="text-green-400" /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm">{toast.msg}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex-grow relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:bg-white border border-transparent focus:border-red-200 transition-all"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setEditing(empty())}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-100"
        >
          <Plus size={18} />
          New Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Products', value: products.length },
          { label: 'Published', value: products.filter(p => p.is_published).length },
          { label: 'Drafts', value: products.filter(p => !p.is_published).length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="text-3xl font-black text-gray-900 mb-1">{s.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-300 italic">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="text-gray-300 text-5xl mb-4">📦</div>
          <p className="text-gray-400 italic">No products yet. Click "New Product" to add one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="relative h-48 bg-gray-50">
                {product.cover_url ? (
                  <img src={product.cover_url} alt={product.name_en} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={32} className="text-gray-200" />
                  </div>
                )}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
                <span className={`absolute top-3 right-3 text-[9px] font-black uppercase px-2 py-1 rounded-full ${product.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {product.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg font-serif mb-1">{product.name_en}</h3>
                <p className="text-xs text-gray-400 italic mb-1">{product.name_fr}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{product.description_en}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(product)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 text-xs font-bold transition-all"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  {deleteConfirm === product.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleDelete(product.id!)} className="px-3 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all">Confirm</button>
                      <button onClick={() => setDeleteConfirm(null)} className="px-3 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(product.id!)}
                      className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] ${toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <Check size={20} className="text-green-400" /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm">{toast.msg}</span>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
