import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, Plus, Trash2, Edit3, Image as ImageIcon, Search, Check, AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import MediaPicker from '../components/MediaPicker';

const BlogManager = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [search, setSearch] = useState('');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const makeSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (editingPost) {
      setFormData({ ...editingPost });
      setIsDirty(false);
    } else {
      setFormData(null);
    }
  }, [editingPost]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blog', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!formData) return;
    setSaving(true);
    try {
      const payload = { ...formData };
      if (!payload.slug?.trim() && payload.title_en?.trim()) {
        payload.slug = makeSlug(payload.title_en);
      }
      if (!payload.slug?.trim()) {
        showToast('Slug is required. Add one or set an English title.', 'error');
        return;
      }

      const isNew = !formData.id;
      const url = isNew ? '/api/blog' : `/api/blog/${formData.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsDirty(false);
        setEditingPost(null);
        fetchPosts();
        showToast('Article saved successfully');
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Save failed' }));
        showToast(errorData.error || 'Save failed', 'error');
      }
    } catch {
      showToast('Save failed. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleNewPost = () => {
    setEditingPost({
      slug: '',
      title_en: '',
      title_fr: '',
      body_en: '',
      body_fr: '',
      author: 'Admin',
      is_published: false,
      published_at: null,
      cover_image_id: null,
      meta_title_en: '',
      meta_title_fr: '',
      meta_desc_en: '',
      meta_desc_fr: ''
    });
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      if (!res.ok) throw new Error();
      if (editingPost?.id === id) {
        setEditingPost(null);
      }
      showToast('Article deleted');
      fetchPosts();
    } catch {
      showToast('Failed to delete article', 'error');
    }
  };

  const filteredPosts = posts.filter(p => 
    (p.title_en || '').toLowerCase().includes(search.toLowerCase()) || 
    (p.title_fr || '').toLowerCase().includes(search.toLowerCase())
  );

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  if (loading && posts.length === 0) return <div className="p-8">Loading blog posts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif italic text-gray-900">Articles & Actualités</h1>
          <p className="text-gray-500 mt-1">Management of editorial content</p>
        </div>
        <button 
          onClick={handleNewPost}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
        >
          <Plus size={20} />
          Create New Article
        </button>
      </div>

      {!editingPost ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-red-500 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="divide-y divide-gray-50">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-6 flex items-center gap-6 group hover:bg-gray-50 transition-colors">
                <div className="w-20 aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  {post.cover_url && <img src={post.cover_url} className="w-full h-full object-cover" alt="" />}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono tracking-tighter">/{post.slug}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">{post.title_en}</h3>
                  <div className="text-xs text-gray-400 font-serif italic mt-0.5">FR: {post.title_fr}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Author</div>
                  <div className="text-xs font-medium text-gray-600">{post.author}</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingPost(post)}
                    className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-600 hover:shadow-md transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-600 hover:shadow-md transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : formData ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24 z-20">
            <button onClick={() => setEditingPost(null)} className="p-3 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
              <X size={20} />
            </button>
            <div className="flex-grow">
              <div className="text-[10px] font-black uppercase tracking-widest text-red-600">Editing Article</div>
              <h2 className="text-2xl font-serif italic text-gray-900">{formData?.title_en || 'New Article'}</h2>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleSave}
                disabled={saving || !isDirty}
                className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-100 hover:bg-red-700 transition-all disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Article'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="col-span-2 space-y-8">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 space-y-8 shadow-sm">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">Article Title (EN)</label>
                    <input 
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-xl font-serif italic outline-none focus:bg-white focus:border-red-500 transition-all"
                      value={formData.title_en}
                      onChange={(e) => handleInputChange('title_en', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">Article Title (FR)</label>
                    <input 
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-xl font-serif italic outline-none focus:bg-white focus:border-red-500 transition-all"
                      value={formData.title_fr}
                      onChange={(e) => handleInputChange('title_fr', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex bg-blue-600 p-3 rounded-t-xl text-white text-[10px] font-black uppercase tracking-widest">Body Content (EN)</div>
                  <ReactQuill 
                    theme="snow"
                    value={formData.body_en}
                    onChange={(val) => handleInputChange('body_en', val)}
                    modules={quillModules}
                    className="rounded-b-xl overflow-hidden min-h-[400px]"
                  />
                </div>

                <div>
                  <div className="flex bg-red-600 p-3 rounded-t-xl text-white text-[10px] font-black uppercase tracking-widest">Body Content (FR)</div>
                  <ReactQuill 
                    theme="snow"
                    value={formData.body_fr}
                    onChange={(val) => handleInputChange('body_fr', val)}
                    modules={quillModules}
                    className="rounded-b-xl overflow-hidden min-h-[400px]"
                  />
                </div>
              </div>

              {/* SEO Block */}
              <div className="bg-white rounded-3xl border border-gray-200 p-8 space-y-8 shadow-sm">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-300 border-b border-gray-50 pb-4">SEO & Search Performance</h3>
                 <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-4">
                     <div>
                       <label className="block text-[10px] font-black text-blue-500 uppercase mb-2">Meta Title (EN)</label>
                       <input 
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-blue-200"
                        value={formData.meta_title_en || ''}
                        onChange={(e) => handleInputChange('meta_title_en', e.target.value)}
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-blue-500 uppercase mb-2">Meta Description (EN)</label>
                       <textarea 
                        rows={4}
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-blue-200"
                        value={formData.meta_desc_en || ''}
                        onChange={(e) => handleInputChange('meta_desc_en', e.target.value)}
                       />
                     </div>
                   </div>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-[10px] font-black text-red-500 uppercase mb-2">Meta Title (FR)</label>
                       <input 
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-red-200"
                        value={formData.meta_title_fr || ''}
                        onChange={(e) => handleInputChange('meta_title_fr', e.target.value)}
                       />
                     </div>
                     <div>
                       <label className="block text-[10px] font-black text-red-500 uppercase mb-2">Meta Description (FR)</label>
                       <textarea 
                        rows={4}
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-red-200"
                        value={formData.meta_desc_fr || ''}
                        onChange={(e) => handleInputChange('meta_desc_fr', e.target.value)}
                       />
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Sidebar Settings */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-300 border-b border-gray-50 pb-4">Status & Publishing</h3>
                
                <div>
                   <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">Cover Image</label>
                   <div 
                    onClick={() => setMediaPickerOpen(true)}
                    className="group relative aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-red-200"
                   >
                     {formData.cover_image_id ? (
                       <img src={formData.cover_url} className="w-full h-full object-cover" alt="" />
                     ) : (
                       <div className="text-center group-hover:scale-110 transition-transform">
                         <ImageIcon size={32} className="text-gray-200 mx-auto mb-2" />
                         <span className="text-[10px] font-bold text-gray-300 uppercase">Select Image</span>
                       </div>
                     )}
                   </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.is_published ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                      {formData.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Status</div>
                      <div className="text-sm font-bold text-gray-900">{formData.is_published ? 'Published' : 'Draft'}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleInputChange('is_published', !formData.is_published)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.is_published ? 'bg-green-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.is_published ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Unique Slug</label>
                  <input 
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm font-mono outline-none focus:bg-white focus:border-red-500 transition-all text-gray-500"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                  />
                  <p className="text-[9px] text-gray-400 mt-2 px-1">Friendly for SEO: words-separated-by-dashes</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Author</label>
                     <input 
                      className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-xs font-bold outline-none focus:bg-white focus:border-red-100"
                      value={formData.author || ''}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                    />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Date</label>
                     <input 
                      type="date"
                      className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-xs font-bold outline-none focus:bg-white focus:border-red-100"
                      value={formData.published_at ? new Date(formData.published_at).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleInputChange('published_at', e.target.value)}
                    />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <MediaPicker 
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        selectedId={formData?.cover_image_id}
        onSelect={(m) => {
          handleInputChange('cover_image_id', m.id);
          setFormData((prev: any) => ({ ...prev, cover_url: m.url }));
          setMediaPickerOpen(false);
        }}
      />

      {toast && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300 z-[100] ${
          toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <Check className="text-green-500" size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
