import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, AlertCircle, Image as ImageIcon, ExternalLink, Eye, EyeOff, Check, X, Plus, FileText } from 'lucide-react';
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

  const openMediaPicker = (field: string) => {
    setActiveImageField(field);
    setMediaPickerOpen(true);
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
                <div className="absolute right-4 top-4">
                  {!p.is_visible && <EyeOff size={14} className="text-gray-300" />}
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
              {[1, 2].map((num) => (
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
