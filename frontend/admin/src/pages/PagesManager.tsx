import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, AlertCircle, Image as ImageIcon, ExternalLink, Eye, EyeOff, Check, X, Plus, FileText, Trash2 } from 'lucide-react';
import MediaPicker from '../components/MediaPicker';

const PagesManager = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showToast, setShowToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeImageField, setActiveImageField] = useState<string | null>(null);
  
  // Create Page State
  const [isCreating, setIsCreating] = useState(false);
  const [newBrandPage, setNewBrandPage] = useState({ slug: '', en: '', fr: '' });

  // Delete Page State
  const [pageToDelete, setPageToDelete] = useState<any>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      setFormData({ ...selectedPage });
      setIsDirty(false);
    }
  }, [selectedPage]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pages', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPages(data);
        if (data.length > 0 && !selectedPage) {
          const firstPage = data.find((p: any) => !p.slug.endsWith('-header')) || data[0];
          setSelectedPage(firstPage);
        }
      } else {
        setPages([]);
      }
    } catch (err) {
      console.error('Fetch pages failed', err);
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandPage.slug || !newBrandPage.en || !newBrandPage.fr) return;
    
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          slug: newBrandPage.slug,
          menu_label_en: newBrandPage.en,
          menu_label_fr: newBrandPage.fr
        })
      });
      
      if (res.ok) {
        setIsCreating(false);
        setNewBrandPage({ slug: '', en: '', fr: '' });
        await fetchPages();
      }
    } catch (err) {
      console.error('Failed to create page');
    }
  };

  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    try {
      const res = await fetch(`/api/pages/${pageToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      if (res.ok) {
        setPageToDelete(null);
        if (selectedPage?.id === pageToDelete.id) {
          setSelectedPage(null);
          setFormData(null);
        }
        await fetchPages();
        setShowToast({ message: 'Page deleted successfully', type: 'success' });
      } else {
        setShowToast({ message: 'Failed to delete page', type: 'error' });
      }
    } catch (err) {
      setShowToast({ message: 'Failed to delete page', type: 'error' });
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
      const res = await fetch(`/api/pages/${formData.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowToast({ message: 'Changes saved successfully', type: 'success' });
        setIsDirty(false);
        fetchPages(); // Update sidebar info
        setTimeout(() => setShowToast(null), 3000);
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      console.error('Save failed', err);
      setShowToast({ message: 'Save failed — please try again', type: 'error' });
      setTimeout(() => setShowToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelect = (media: any) => {
    if (activeImageField) {
      handleInputChange(activeImageField, media.id);
      // Also update temporary preview URL
      setFormData((prev: any) => ({ ...prev, [`${activeImageField}_url`]: media.url }));
    }
    setMediaPickerOpen(false);
    setActiveImageField(null);
  };

  const openMediaPickerForField = (fieldPath: string) => {
    setActiveImageField(fieldPath);
    setMediaPickerOpen(true);
  };

  const updateNestedField = (section: string, index: number, field: string, value: any) => {
    const items = formData[section] || [];
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange(section, updated);
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  if (loading) return <div className="h-full flex items-center justify-center py-20 text-gray-400 bg-white">Loading site pages...</div>;

  return (
    <div className="flex gap-8 items-start h-[calc(100vh-160px)] bg-gray-50 p-4 rounded-3xl flex-col lg:flex-row">
      {/* Sidebar List */}
      <div className="w-full lg:w-96 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div className="font-bold text-[10px] uppercase tracking-[0.2em] text-gray-400">
            Sitemap & Architecture
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="p-1 hover:bg-gray-200 rounded-md text-red-600 transition-colors"
            title="Add New Page"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto divide-y divide-gray-50 scrollbar-hide">
          {pages.map((p) => {
            const isHeader = p.slug.endsWith('-header');
            if (isHeader) {
              return (
                <div key={p.id} className="p-4 bg-gray-50/50 text-[11px] font-black uppercase tracking-[0.15em] text-red-600/60 mt-4 first:mt-0 sticky top-0 z-10 backdrop-blur-sm">
                  {p.menu_label_en}
                </div>
              );
            }
            return (
              <button
                key={p.id}
                onClick={() => {
                  if (!isHeader) {
                    if (isDirty && !window.confirm('You have unsaved changes. Discard them?')) return;
                    setSelectedPage(p);
                  }
                }}
                className={`w-full p-4 pl-6 text-left group transition-all relative flex flex-col items-start justify-between ${
                  selectedPage?.id === p.id 
                    ? 'bg-red-50 text-red-600' 
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="w-full">
                   <div className="font-bold text-sm break-words whitespace-normal">{p.menu_label_en}</div>
                   <div className="text-[10px] opacity-40 font-mono mt-0.5">/{p.slug === 'home' ? '' : p.slug}</div>
                </div>
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  {!p.is_visible && <EyeOff size={14} className="text-gray-300" />}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isDirty && selectedPage?.id === p.id) {
                        if (!window.confirm('You have unsaved changes. Discard them?')) return;
                      }
                      setPageToDelete(p);
                    }}
                    className="p-1 hover:bg-red-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete page"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
                {selectedPage?.id === p.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="flex-grow w-full h-full overflow-y-auto pr-2 space-y-6 bg-white rounded-3xl p-8 border border-gray-100 shadow-inner">
        {formData ? (
          <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-1">Editing Page</div>
                <h1 className="text-3xl font-serif italic text-gray-900">{formData.menu_label_en}</h1>
              </div>
              <div className="flex items-center gap-4">
                {isDirty && (
                  <div className="flex items-center gap-2 text-amber-500 text-xs font-bold bg-amber-50 px-3 py-1.5 rounded-full">
                    <AlertCircle size={14} /> Unsaved Changes
                  </div>
                )}
                <button 
                  onClick={handleSave}
                  disabled={saving || !isDirty}
                  className="bg-red-600 text-white px-10 py-4 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-red-100 hover:bg-red-700 transition-all disabled:opacity-50 disabled:shadow-none transform hover:-translate-y-0.5"
                >
                  {saving ? 'Saving...' : (
                    <>
                      <Save size={18} />
                      Save All Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Config & Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-[10px] uppercase tracking-widest flex justify-between items-center">
                <span>Page Configuration</span>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Visible on site</span>
                    <button 
                      onClick={() => handleInputChange('is_visible', !formData.is_visible)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${formData.is_visible ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.is_visible ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-8 grid grid-cols-3 gap-8">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">URL Slug</label>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden px-3">
                    <span className="text-gray-400 text-xs">/</span>
                    <input 
                      className="flex-grow py-3 bg-transparent text-sm font-mono outline-none"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-amber-500 mt-2 font-medium">Changing the slug will break existing links!</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Menu Label (EN)</label>
                  <input 
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-red-600"
                    value={formData.menu_label_en}
                    onChange={(e) => handleInputChange('menu_label_en', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Menu Label (FR)</label>
                  <input 
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-red-600"
                    value={formData.menu_label_fr}
                    onChange={(e) => handleInputChange('menu_label_fr', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* EN / FR Split Editor */}
            <div className="grid grid-cols-2 gap-8  top-24">
              <div className="bg-blue-600 py-3 px-6 rounded-t-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-50">English Version</div>
              <div className="bg-red-600 py-3 px-6 rounded-t-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-50">Version Française</div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Content Sections */}
              {[
                { label: 'Main Page Title', en: 'title_en', fr: 'title_fr' },
                { label: 'Hero Subtitle 1', en: 'subtitle_1_en', fr: 'subtitle_1_fr' },
                { label: 'Hero Subtitle 2', en: 'subtitle_2_en', fr: 'subtitle_2_fr' },
              ].map((section) => (
                <React.Fragment key={section.en}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">{section.label}</label>
                    <input 
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-lg font-serif italic outline-none focus:bg-white focus:border-blue-500 transition-all"
                      value={formData[section.en] || ''}
                      onChange={(e) => handleInputChange(section.en, e.target.value)}
                      placeholder={`Enter ${section.label}...`}
                    />
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">{section.label} (FR)</label>
                    <input 
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-lg font-serif italic outline-none focus:bg-white focus:border-red-500 transition-all"
                      value={formData[section.fr] || ''}
                      onChange={(e) => handleInputChange(section.fr, e.target.value)}
                      placeholder={`Entrez le ${section.label.toLowerCase()}...`}
                    />
                  </div>
                </React.Fragment>
              ))}

              {/* Rich Text Blocks */}
              {[
                { label: 'Primary Body Paragraph', en: 'body_1_en', fr: 'body_1_fr' },
                { label: 'Secondary Body Block', en: 'body_2_en', fr: 'body_2_fr' },
              ].map((section) => (
                <React.Fragment key={section.en}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">{section.label}</label>
                    <ReactQuill 
                      theme="snow"
                      value={formData[section.en] || ''}
                      onChange={(val) => handleInputChange(section.en, val)}
                      modules={quillModules}
                      className="rounded-xl overflow-hidden"
                    />
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3 text-right">{section.label} (FR)</label>
                    <ReactQuill 
                      theme="snow"
                      value={formData[section.fr] || ''}
                      onChange={(val) => handleInputChange(section.fr, val)}
                      modules={quillModules}
                      className="rounded-xl overflow-hidden"
                    />
                  </div>
                </React.Fragment>
              ))}

              {/* Image Blocks */}
              {[1, 2].map((num) => (
                <React.Fragment key={`img-${num}`}>
                  <div className="col-span-2 grid grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm group">
                      <div className="flex justify-between items-center mb-6">
                        <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Image Slot {num}</label>
                        <button 
                          onClick={() => openMediaPicker(`image_${num}_id`)}
                          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                        >
                          {formData[`image_${num}_id`] ? 'Replace Image' : 'Select Image'}
                        </button>
                      </div>
                      <div className="flex gap-8">
                        <div className="w-48 aspect-[4/5] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 overflow-hidden flex items-center justify-center">
                          {formData[`image_${num}_id`] ? (
                            <img src={formData[`image_${num}_id_url`] || pages.find(p => p.id === formData.id)?.[`image_${num}_id_url`]} className="w-full h-full object-cover" alt="Preview" />
                          ) : (
                            <ImageIcon className="text-gray-200" size={48} />
                          )}
                        </div>
                        <div className="flex-grow space-y-4">
                          <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase mb-1">Alt Text (EN)</label>
                            <input 
                              placeholder="Describe image for screen readers..."
                              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-xs outline-none focus:bg-white focus:border-blue-200 transition-all"
                              value={formData[`image_${num}_alt_en`] || ''}
                              onChange={(e) => handleInputChange(`image_${num}_alt_en`, e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase mb-1">Caption (EN)</label>
                            <textarea 
                              placeholder="Brief description under image..."
                              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-xs outline-none focus:bg-white focus:border-blue-200 transition-all h-20"
                              value={formData[`image_${num}_caption_en`] || ''}
                              onChange={(e) => handleInputChange(`image_${num}_caption_en`, e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Image Slot {num} (FR)</label>
                      </div>
                       <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase mb-1">Texte Alt (FR)</label>
                            <input 
                              placeholder="Description pour les lecteurs d'écran..."
                              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-xs outline-none focus:bg-white focus:border-red-200 transition-all"
                              value={formData[`image_${num}_alt_fr`] || ''}
                              onChange={(e) => handleInputChange(`image_${num}_alt_fr`, e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase mb-1">Légende (FR)</label>
                            <textarea 
                              placeholder="Brève description sous l'image..."
                              className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-xs outline-none focus:bg-white focus:border-red-200 transition-all h-32"
                              value={formData[`image_${num}_caption_fr`] || ''}
                              onChange={(e) => handleInputChange(`image_${num}_caption_fr`, e.target.value)}
                            />
                          </div>
                        </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* Button Blocks */}
              {[1, 2, 3].map((num) => (
                <React.Fragment key={`btn-${num}`}>
                   <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Button {num}</label>
                        <button 
                          onClick={() => handleInputChange(`button_${num}_enabled`, !formData[`button_${num}_enabled`])}
                          className={`w-10 h-5 rounded-full transition-colors relative ${formData[`button_${num}_enabled`] ? 'bg-blue-500' : 'bg-gray-200'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData[`button_${num}_enabled`] ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-300 uppercase mb-1">Label (EN)</label>
                        <input 
                          className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
                          value={formData[`button_${num}_label_en`] || ''}
                          onChange={(e) => handleInputChange(`button_${num}_label_en`, e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-300 uppercase mb-1">URL / Link</label>
                        <input 
                          placeholder="/page or https://..."
                          className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm font-mono outline-none focus:bg-white focus:border-blue-500 transition-all"
                          value={formData[`button_${num}_url`] || ''}
                          onChange={(e) => handleInputChange(`button_${num}_url`, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase block mb-6">Button {num} (FR)</label>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-300 uppercase mb-1">Label (FR)</label>
                        <input 
                          className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm font-bold outline-none focus:bg-white focus:border-red-500 transition-all"
                          value={formData[`button_${num}_label_fr`] || ''}
                          onChange={(e) => handleInputChange(`button_${num}_label_fr`, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* Additional Body Sections */}
              {[
                { label: 'Extended Content Block 1', en: 'body_3_en', fr: 'body_3_fr' },
                { label: 'Extended Content Block 2', en: 'body_4_en', fr: 'body_4_fr' },
              ].map((section) => (
                <React.Fragment key={section.en}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">{section.label}</label>
                    <ReactQuill 
                      theme="snow"
                      value={formData[section.en] || ''}
                      onChange={(val) => handleInputChange(section.en, val)}
                      modules={quillModules}
                      className="rounded-xl overflow-hidden"
                    />
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3 text-right">{section.label} (FR)</label>
                    <ReactQuill 
                      theme="snow"
                      value={formData[section.fr] || ''}
                      onChange={(val) => handleInputChange(section.fr, val)}
                      modules={quillModules}
                      className="rounded-xl overflow-hidden"
                    />
                  </div>
                </React.Fragment>
              ))}

              {/* Additional Subtitle Section */}
              {[
                { label: 'Subtitle 3', en: 'subtitle_3_en', fr: 'subtitle_3_fr' },
              ].map((section) => (
                <React.Fragment key={section.en}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3">{section.label}</label>
                    <input 
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-lg font-serif italic outline-none focus:bg-white focus:border-blue-500 transition-all"
                      value={formData[section.en] || ''}
                      onChange={(e) => handleInputChange(section.en, e.target.value)}
                      placeholder={`Enter ${section.label}...`}
                    />
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <label className="block text-[10px] font-black tracking-widest text-gray-400 uppercase mb-3 text-right">{section.label} (FR)</label>
                    <input 
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-lg font-serif italic outline-none focus:bg-white focus:border-red-500 transition-all"
                      value={formData[section.fr] || ''}
                      onChange={(e) => handleInputChange(section.fr, e.target.value)}
                      placeholder={`Entrez le ${section.label.toLowerCase()}...`}
                    />
                  </div>
                </React.Fragment>
              ))}

              {/* Third Image Slot */}
              <div className="col-span-2 grid grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm group">
                  <div className="flex justify-between items-center mb-6">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Image Slot 3</label>
                    <button 
                      onClick={() => openMediaPicker(`image_3_id`)}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                    >
                      {formData[`image_3_id`] ? 'Replace Image' : 'Select Image'}
                    </button>
                  </div>
                  <div className="flex gap-8">
                    <div className="w-48 aspect-[4/5] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 overflow-hidden flex items-center justify-center">
                      {formData[`image_3_id`] ? (
                        <img src={formData[`image_3_id_url`] || pages.find(p => p.id === formData.id)?.[`image_3_id_url`]} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <ImageIcon className="text-gray-200" size={48} />
                      )}
                    </div>
                    <div className="flex-grow space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-300 uppercase mb-1">Alt Text (EN)</label>
                        <input 
                          placeholder="Describe image for screen readers..."
                          className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-xs outline-none focus:bg-white focus:border-blue-200 transition-all"
                          value={formData[`image_3_alt_en`] || ''}
                          onChange={(e) => handleInputChange(`image_3_alt_en`, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Image Slot 3 (FR)</label>
                  </div>
                   <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-300 uppercase mb-1">Texte Alt (FR)</label>
                        <input 
                          placeholder="Description pour les lecteurs d'écran..."
                          className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-xs outline-none focus:bg-white focus:border-red-200 transition-all"
                          value={formData[`image_3_alt_fr`] || ''}
                          onChange={(e) => handleInputChange(`image_3_alt_fr`, e.target.value)}
                        />
                      </div>
                    </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="col-span-2">
                <div className="bg-gradient-to-r from-blue-50 to-transparent p-8 rounded-3xl border border-blue-100 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-serif italic text-gray-900">FAQ Section</h3>
                    <button
                      onClick={() => {
                        const faqs = formData.faqs || [];
                        handleInputChange('faqs', [...faqs, { q_en: '', a_en: '', q_fr: '', a_fr: '' }]);
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      <Plus size={14} /> Add FAQ Item
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-white rounded-xl border border-blue-100">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Section Title (EN)</label>
                      <input
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                        value={formData.faq_title_en || ''}
                        onChange={(e) => handleInputChange('faq_title_en', e.target.value)}
                        placeholder="e.g., Frequently Asked Questions"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Titre de Section (FR)</label>
                      <input
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                        value={formData.faq_title_fr || ''}
                        onChange={(e) => handleInputChange('faq_title_fr', e.target.value)}
                        placeholder="p.ex., Questions Fréquentes"
                      />
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">Manage FAQ questions and answers</p>
                </div>

                {(formData.faqs || []).map((faq, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-8 mb-8 p-8 bg-white rounded-3xl border border-gray-200">
                    <div className="col-span-2 flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                      <h4 className="font-bold text-gray-600">FAQ Item #{idx + 1}</h4>
                      <button 
                        onClick={() => {
                          const faqs = formData.faqs.filter((_, i) => i !== idx);
                          handleInputChange('faqs', faqs);
                        }}
                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-all text-sm font-bold"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Question (EN)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                        value={faq.q_en || ''}
                        onChange={(e) => {
                          const faqs = [...formData.faqs];
                          faqs[idx].q_en = e.target.value;
                          handleInputChange('faqs', faqs);
                        }}
                        placeholder="Enter question..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Question (FR)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-500 transition-all"
                        value={faq.q_fr || ''}
                        onChange={(e) => {
                          const faqs = [...formData.faqs];
                          faqs[idx].q_fr = e.target.value;
                          handleInputChange('faqs', faqs);
                        }}
                        placeholder="Entrez la question..."
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Answer (EN)</label>
                      <textarea 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all h-24"
                        value={faq.a_en || ''}
                        onChange={(e) => {
                          const faqs = [...formData.faqs];
                          faqs[idx].a_en = e.target.value;
                          handleInputChange('faqs', faqs);
                        }}
                        placeholder="Enter answer..."
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Réponse (FR)</label>
                      <textarea 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-500 transition-all h-24"
                        value={faq.a_fr || ''}
                        onChange={(e) => {
                          const faqs = [...formData.faqs];
                          faqs[idx].a_fr = e.target.value;
                          handleInputChange('faqs', faqs);
                        }}
                        placeholder="Entrez la réponse..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Products Section */}
              <div className="col-span-2">
                <div className="bg-gradient-to-r from-green-50 to-transparent p-8 rounded-3xl border border-green-100 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-serif italic text-gray-900">Products Section</h3>
                    <button 
                      onClick={() => {
                        const products = formData.products || [];
                        handleInputChange('products', [...products, { title_en: '', title_fr: '', subtitle_en: '', subtitle_fr: '', desc_en: '', desc_fr: '', badge_en: '', badge_fr: '', image_id: null }]);
                      }}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Product
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-white rounded-xl border border-green-100">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Section Title (EN)</label>
                      <input 
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-green-500 transition-all"
                        value={formData.products_title_en || ''}
                        onChange={(e) => handleInputChange('products_title_en', e.target.value)}
                        placeholder="e.g., Our Treasures"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Titre de Section (FR)</label>
                      <input 
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-green-500 transition-all"
                        value={formData.products_title_fr || ''}
                        onChange={(e) => handleInputChange('products_title_fr', e.target.value)}
                        placeholder="p.ex., Nos Trésors"
                      />
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">Manage featured products/treasures</p>
                </div>

                {(formData.products || []).map((product, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-8 mb-8 p-8 bg-white rounded-3xl border border-gray-200">
                    <div className="col-span-3 flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                      <h4 className="font-bold text-gray-600">Product #{idx + 1}</h4>
                      <button 
                        onClick={() => {
                          const products = formData.products.filter((_, i) => i !== idx);
                          handleInputChange('products', products);
                        }}
                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-all text-sm font-bold"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    {/* Image Upload */}
                    <div className="col-span-3">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Product Image</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => openMediaPickerForField(`products_${idx}_image_id`)}
                          className="px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm font-bold hover:bg-blue-100 transition-all flex items-center gap-2"
                        >
                          <ImageIcon size={16} /> Choose Image
                        </button>
                        {product.image_url && (
                          <div className="flex items-center gap-2">
                            <img src={product.image_url} alt="Preview" className="h-16 w-16 object-cover rounded" />
                            <span className="text-xs text-gray-500">Selected</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Title (EN)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                        value={product.title_en || ''}
                        onChange={(e) => updateNestedField('products', idx, 'title_en', e.target.value)}
                        placeholder="Product title..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Titre (FR)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-500 transition-all"
                        value={product.title_fr || ''}
                        onChange={(e) => updateNestedField('products', idx, 'title_fr', e.target.value)}
                        placeholder="Titre du produit..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Badge</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                        value={product.badge_en || ''}
                        onChange={(e) => updateNestedField('products', idx, 'badge_en', e.target.value)}
                        placeholder="e.g., Premium, Bio"
                      />
                    </div>
                    
                    <div className="col-span-3">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Description (EN)</label>
                      <textarea 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all h-16"
                        value={product.desc_en || ''}
                        onChange={(e) => updateNestedField('products', idx, 'desc_en', e.target.value)}
                        placeholder="Product description..."
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Description (FR)</label>
                      <textarea 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-500 transition-all h-16"
                        value={product.desc_fr || ''}
                        onChange={(e) => updateNestedField('products', idx, 'desc_fr', e.target.value)}
                        placeholder="Description du produit..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Gallery Section */}
              <div className="col-span-2">
                <div className="bg-gradient-to-r from-purple-50 to-transparent p-8 rounded-3xl border border-purple-100 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-serif italic text-gray-900">Gallery Section</h3>
                    <button 
                      onClick={() => {
                        const gallery = formData.gallery || [];
                        handleInputChange('gallery', [...gallery, { caption_en: '', caption_fr: '', image_id: null }]);
                      }}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Gallery Item
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-white rounded-xl border border-purple-100">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Section Title (EN)</label>
                      <input 
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-purple-500 transition-all"
                        value={formData.gallery_title_en || ''}
                        onChange={(e) => handleInputChange('gallery_title_en', e.target.value)}
                        placeholder="e.g., Gallery"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Titre de Section (FR)</label>
                      <input 
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-purple-500 transition-all"
                        value={formData.gallery_title_fr || ''}
                        onChange={(e) => handleInputChange('gallery_title_fr', e.target.value)}
                        placeholder="p.ex., Galerie"
                      />
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">Manage gallery images and captions</p>
                </div>

                {(formData.gallery || []).map((item, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-8 mb-8 p-8 bg-white rounded-3xl border border-gray-200">
                    <div className="col-span-2 flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                      <h4 className="font-bold text-gray-600">Gallery Item #{idx + 1}</h4>
                      <button 
                        onClick={() => {
                          const gallery = formData.gallery.filter((_, i) => i !== idx);
                          handleInputChange('gallery', gallery);
                        }}
                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-all text-sm font-bold"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    {/* Image Upload */}
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Gallery Image</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => openMediaPickerForField(`gallery_${idx}_image_id`)}
                          className="px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm font-bold hover:bg-blue-100 transition-all flex items-center gap-2"
                        >
                          <ImageIcon size={16} /> Choose Image
                        </button>
                        {item.image_url && (
                          <div className="flex items-center gap-2">
                            <img src={item.image_url} alt="Preview" className="h-16 w-16 object-cover rounded" />
                            <span className="text-xs text-gray-500">Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Caption (EN)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                        value={item.caption_en || ''}
                        onChange={(e) => updateNestedField('gallery', idx, 'caption_en', e.target.value)}
                        placeholder="Enter caption..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Légende (FR)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-500 transition-all"
                        value={item.caption_fr || ''}
                        onChange={(e) => updateNestedField('gallery', idx, 'caption_fr', e.target.value)}
                        placeholder="Entrez la légende..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline Section */}
              <div className="col-span-2">
                <div className="bg-gradient-to-r from-yellow-50 to-transparent p-8 rounded-3xl border border-yellow-100 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-serif italic text-gray-900">Timeline Section</h3>
                    <button 
                      onClick={() => {
                        const timeline = formData.timeline || [];
                        handleInputChange('timeline', [...timeline, { date: '', title_en: '', title_fr: '', desc_en: '', desc_fr: '', image_id: null }]);
                      }}
                      className="bg-yellow-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-yellow-700 transition-all flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Timeline Era
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-white rounded-xl border border-yellow-100">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Section Title (EN)</label>
                      <input 
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-yellow-500 transition-all"
                        value={formData.timeline_title_en || ''}
                        onChange={(e) => handleInputChange('timeline_title_en', e.target.value)}
                        placeholder="e.g., Timeline"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Titre de Section (FR)</label>
                      <input 
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-yellow-500 transition-all"
                        value={formData.timeline_title_fr || ''}
                        onChange={(e) => handleInputChange('timeline_title_fr', e.target.value)}
                        placeholder="p.ex., Chronologie"
                      />
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">Manage historical timeline eras</p>
                </div>

                {(formData.timeline || []).map((era, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-8 mb-8 p-8 bg-white rounded-3xl border border-gray-200">
                    <div className="col-span-3 flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                      <h4 className="font-bold text-gray-600">Era #{idx + 1}</h4>
                      <button 
                        onClick={() => {
                          const timeline = formData.timeline.filter((_, i) => i !== idx);
                          handleInputChange('timeline', timeline);
                        }}
                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-all text-sm font-bold"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    {/* Image Upload */}
                    <div className="col-span-3">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Timeline Image</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => openMediaPickerForField(`timeline_${idx}_image_id`)}
                          className="px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm font-bold hover:bg-blue-100 transition-all flex items-center gap-2"
                        >
                          <ImageIcon size={16} /> Choose Image
                        </button>
                        {era.image_url && (
                          <div className="flex items-center gap-2">
                            <img src={era.image_url} alt="Preview" className="h-16 w-16 object-cover rounded" />
                            <span className="text-xs text-gray-500">Selected</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-3">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Date</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm font-mono outline-none focus:bg-white focus:border-blue-500 transition-all"
                        value={era.date || ''}
                        onChange={(e) => updateNestedField('timeline', idx, 'date', e.target.value)}
                        placeholder="e.g., 8000 BC, 146 BC, 17th C."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Title (EN)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                        value={era.title_en || ''}
                        onChange={(e) => updateNestedField('timeline', idx, 'title_en', e.target.value)}
                        placeholder="Era name..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Titre (FR)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-500 transition-all"
                        value={era.title_fr || ''}
                        onChange={(e) => updateNestedField('timeline', idx, 'title_fr', e.target.value)}
                        placeholder="Nom de l'ère..."
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Description (EN)</label>
                      <textarea 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all h-20"
                        value={era.desc_en || ''}
                        onChange={(e) => updateNestedField('timeline', idx, 'desc_en', e.target.value)}
                        placeholder="Era description..."
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Description (FR)</label>
                      <textarea 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-500 transition-all h-20"
                        value={era.desc_fr || ''}
                        onChange={(e) => updateNestedField('timeline', idx, 'desc_fr', e.target.value)}
                        placeholder="Description de l'ère..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Partners Section */}
              <div className="col-span-2">
                <div className="bg-gradient-to-r from-red-50 to-transparent p-8 rounded-3xl border border-red-100 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-serif italic text-gray-900">Partners Section</h3>
                    <button
                      onClick={() => {
                        const partners = formData.partners || [];
                        handleInputChange('partners', [...partners, { name_en: '', name_fr: '', role_en: '', role_fr: '', desc_en: '', desc_fr: '' }]);
                      }}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Partner
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-white rounded-xl border border-red-100">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Section Title (EN)</label>
                      <input
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-red-500 transition-all"
                        value={formData.partners_title_en || ''}
                        onChange={(e) => handleInputChange('partners_title_en', e.target.value)}
                        placeholder="e.g., Our Partners"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Titre de Section (FR)</label>
                      <input
                        className="w-full p-3 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-red-500 transition-all"
                        value={formData.partners_title_fr || ''}
                        onChange={(e) => handleInputChange('partners_title_fr', e.target.value)}
                        placeholder="p.ex., Nos Partenaires"
                      />
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">Manage partner organizations and collaborations</p>
                </div>

                {(formData.partners || []).map((partner, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-8 mb-8 p-8 bg-white rounded-3xl border border-gray-200">
                    <div className="col-span-2 flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                      <h4 className="font-bold text-gray-600">Partner #{idx + 1}</h4>
                      <button 
                        onClick={() => {
                          const partners = formData.partners.filter((_, i) => i !== idx);
                          handleInputChange('partners', partners);
                        }}
                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-all text-sm font-bold"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Name (EN)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                        value={partner.name_en || ''}
                        onChange={(e) => {
                          const partners = [...formData.partners];
                          partners[idx].name_en = e.target.value;
                          handleInputChange('partners', partners);
                        }}
                        placeholder="Partner name..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Nom (FR)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-500 transition-all"
                        value={partner.name_fr || ''}
                        onChange={(e) => {
                          const partners = [...formData.partners];
                          partners[idx].name_fr = e.target.value;
                          handleInputChange('partners', partners);
                        }}
                        placeholder="Nom du partenaire..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Role (EN)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all"
                        value={partner.role_en || ''}
                        onChange={(e) => {
                          const partners = [...formData.partners];
                          partners[idx].role_en = e.target.value;
                          handleInputChange('partners', partners);
                        }}
                        placeholder="Partner role..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Rôle (FR)</label>
                      <input 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-500 transition-all"
                        value={partner.role_fr || ''}
                        onChange={(e) => {
                          const partners = [...formData.partners];
                          partners[idx].role_fr = e.target.value;
                          handleInputChange('partners', partners);
                        }}
                        placeholder="Rôle du partenaire..."
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Description (EN)</label>
                      <textarea 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all h-20"
                        value={partner.desc_en || ''}
                        onChange={(e) => {
                          const partners = [...formData.partners];
                          partners[idx].desc_en = e.target.value;
                          handleInputChange('partners', partners);
                        }}
                        placeholder="Partner description..."
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Description (FR)</label>
                      <textarea 
                        className="w-full p-4 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-red-500 transition-all h-20"
                        value={partner.desc_fr || ''}
                        onChange={(e) => {
                          const partners = [...formData.partners];
                          partners[idx].desc_fr = e.target.value;
                          handleInputChange('partners', partners);
                        }}
                        placeholder="Description du partenaire..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 py-40">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText size={40} className="text-gray-400" />
            </div>
            <div className="font-serif italic text-2xl text-gray-900">Select a page to start editing</div>
          </div>
        )}
      </div>

      <MediaPicker 
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        selectedId={activeImageField ? formData?.[activeImageField] : null}
        onSelect={handleMediaSelect}
      />

      {/* Create Page Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif italic text-gray-900">Create New Page</h2>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">URL Slug</label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3">
                  <span className="text-gray-400 text-sm">/</span>
                  <input
                    type="text"
                    className="flex-grow py-3 bg-transparent text-sm font-mono outline-none"
                    value={newBrandPage.slug}
                    onChange={(e) => setNewBrandPage({ ...newBrandPage, slug: e.target.value })}
                    placeholder="page-name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Menu Label (EN)</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-500"
                  value={newBrandPage.en}
                  onChange={(e) => setNewBrandPage({ ...newBrandPage, en: e.target.value })}
                  placeholder="Page Name"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Menu Label (FR)</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-500"
                  value={newBrandPage.fr}
                  onChange={(e) => setNewBrandPage({ ...newBrandPage, fr: e.target.value })}
                  placeholder="Nom de la Page"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
                >
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pageToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-serif italic text-gray-900">Delete Page</h2>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>"{pageToDelete.menu_label_en}"</strong>? This will permanently remove the page and all its content.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPageToDelete(null)}
                className="flex-1 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePage}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
              >
                Delete Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300 z-[100] ${
          showToast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'
        }`}>
          {showToast.type === 'success' ? <Check className="text-green-500" size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm">{showToast.message}</span>
        </div>
      )}
    </div>
  );
};

export default PagesManager;
