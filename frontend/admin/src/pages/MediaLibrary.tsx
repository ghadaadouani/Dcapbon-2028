import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Trash2, Search, Image as ImageIcon, File, X, CheckCircle, AlertCircle, Copy, Grid, List, RefreshCw } from 'lucide-react';

interface MediaFile {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text_en?: string;
  alt_text_fr?: string;
  uploaded_at: string;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const MediaLibrary = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'document'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingAlt, setEditingAlt] = useState<{ en: string; fr: string }>({ en: '', fr: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const url = typeFilter !== 'all' ? `/api/media?type=${typeFilter}` : '/api/media';
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch { showToast('Failed to load media files', 'error'); }
    finally { setLoading(false); }
  }, [typeFilter]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  useEffect(() => {
    if (selected) setEditingAlt({ en: selected.alt_text_en || '', fr: selected.alt_text_fr || '' });
  }, [selected]);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    const names = Array.from(fileList).map(f => f.name);
    setUploadProgress(names);

    const uploads = Array.from(fileList).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: formData
      });
      if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
      return res.json();
    });

    try {
      await Promise.all(uploads);
      showToast(`${fileList.length} file${fileList.length > 1 ? 's' : ''} uploaded successfully`);
      fetchFiles();
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      setUploadProgress([]);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      showToast('File deleted');
      if (selected?.id === id) setSelected(null);
      setDeleteConfirm(null);
      fetchFiles();
    } catch { showToast('Failed to delete file', 'error'); }
  };

  const handleSaveAlt = async () => {
    if (!selected) return;
    try {
      await fetch(`/api/media/${selected.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt_text_en: editingAlt.en, alt_text_fr: editingAlt.fr })
      });
      showToast('Alt text saved');
      setSelected({ ...selected, alt_text_en: editingAlt.en, alt_text_fr: editingAlt.fr });
      setFiles(prev => prev.map(f => f.id === selected.id ? { ...f, alt_text_en: editingAlt.en, alt_text_fr: editingAlt.fr } : f));
    } catch { showToast('Failed to save', 'error'); }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    showToast('URL copied to clipboard');
  };

  const filtered = files.filter(f =>
    f.original_name.toLowerCase().includes(search.toLowerCase())
  );

  const isImage = (mime: string) => mime?.startsWith('image/');

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-white text-sm font-medium transition-all animate-in fade-in slide-in-from-top ${toast.type === 'success' ? 'bg-gray-900' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-serif italic text-gray-900">Media Library</h1>
          <p className="text-gray-400 mt-1 text-sm">{files.length} files · {formatBytes(files.reduce((a, f) => a + (f.size || 0), 0))} total</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchFiles} className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
          <input ref={fileInputRef} type="file" multiple accept="image/*,application/pdf,.doc,.docx" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && uploadProgress.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-blue-700 font-bold text-sm mb-2">Uploading {uploadProgress.length} file{uploadProgress.length > 1 ? 's' : ''}...</div>
          <div className="space-y-1">{uploadProgress.map((name, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-blue-600">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              {name}
            </div>
          ))}</div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleUpload(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-red-400 bg-red-50 scale-[1.01]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
      >
        <Upload size={24} className={`mx-auto mb-3 ${isDragging ? 'text-red-500' : 'text-gray-300'}`} />
        <p className="text-sm font-medium text-gray-500">Drop files here or <span className="text-red-600 font-bold">browse</span></p>
        <p className="text-xs text-gray-400 mt-1">Images (PNG, JPG, WebP, SVG) and Documents (PDF, DOC) · Max 10MB each</p>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-grow">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 transition-colors"
          />
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl p-1">
          {(['all', 'image', 'document'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-4 py-1.5 text-sm font-bold rounded-lg capitalize transition-all ${typeFilter === t ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-gray-600'}`}>{t}</button>
          ))}
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl p-1">
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400'}`}><Grid size={14} /></button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-red-600 text-white' : 'text-gray-400'}`}><List size={14} /></button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* File Grid/List */}
        <div className="flex-grow">
          {loading ? (
            <div className={view === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-2'}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`bg-gray-100 rounded-xl animate-pulse ${view === 'grid' ? 'aspect-square' : 'h-16'}`} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center">
              <ImageIcon size={40} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">{search ? 'No files match your search' : 'No media files yet'}</p>
              <p className="text-gray-400 text-sm mt-1">Upload your first file using the button above</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelected(file)}
                  className={`group relative bg-white border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all ${selected?.id === file.id ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="aspect-square bg-gray-50 flex items-center justify-center">
                    {isImage(file.mime_type) ? (
                      <img src={file.url} alt={file.original_name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <File size={32} className="text-gray-300" />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-700 truncate">{file.original_name}</p>
                    <p className="text-[10px] text-gray-400">{formatBytes(file.size || 0)}</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {deleteConfirm === file.id ? (
                      <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }} className="bg-red-600 text-white p-1 rounded-lg text-xs font-bold">Delete</button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }} className="bg-white text-gray-500 p-1 rounded-lg border">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(file.id); }} className="bg-white/90 backdrop-blur p-1.5 rounded-lg shadow text-gray-500 hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {filtered.map((file, i) => (
                <div key={file.id} onClick={() => setSelected(file)} className={`flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-50' : ''} ${selected?.id === file.id ? 'bg-red-50' : ''}`}>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {isImage(file.mime_type) ? (
                      <img src={file.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <File size={18} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.original_name}</p>
                    <p className="text-xs text-gray-400">{file.mime_type} · {formatBytes(file.size || 0)}</p>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">{new Date(file.uploaded_at).toLocaleDateString()}</div>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(deleteConfirm === file.id ? null : file.id); }} className="p-2 text-gray-300 hover:text-red-600 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-72 flex-shrink-0 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg sticky top-24 self-start">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">File Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-600"><X size={16} /></button>
            </div>
            
            {isImage(selected.mime_type) ? (
              <div className="bg-gray-50 aspect-video flex items-center justify-center overflow-hidden">
                <img src={selected.url} alt={selected.original_name} className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="bg-gray-50 aspect-video flex items-center justify-center">
                <File size={48} className="text-gray-300" />
              </div>
            )}

            <div className="p-5 space-y-4">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Filename</div>
                <p className="text-sm text-gray-800 break-all">{selected.original_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Size</div><p className="text-gray-700">{formatBytes(selected.size || 0)}</p></div>
                <div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Type</div><p className="text-gray-700 truncate">{selected.mime_type}</p></div>
                <div className="col-span-2"><div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Uploaded</div><p className="text-gray-700">{new Date(selected.uploaded_at).toLocaleDateString()}</p></div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Alt Text (EN)</div>
                <input type="text" value={editingAlt.en} onChange={(e) => setEditingAlt(p => ({ ...p, en: e.target.value }))} placeholder="Describe this image..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-400" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Alt Text (FR)</div>
                <input type="text" value={editingAlt.fr} onChange={(e) => setEditingAlt(p => ({ ...p, fr: e.target.value }))} placeholder="Décrivez cette image..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-400" />
              </div>

              <button onClick={handleSaveAlt} className="w-full bg-gray-900 text-white font-bold py-2 rounded-xl text-sm hover:bg-gray-800 transition-colors">Save Alt Text</button>

              <button onClick={() => copyUrl(selected.url)} className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-bold py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                <Copy size={14} /> Copy URL
              </button>

              <button
                onClick={() => { setDeleteConfirm(selected.id); }}
                className="w-full flex items-center justify-center gap-2 border border-red-100 text-red-500 font-bold py-2 rounded-xl text-sm hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} /> Delete File
              </button>

              {deleteConfirm === selected.id && (
                <div className="bg-red-50 rounded-xl p-3 space-y-2">
                  <p className="text-xs text-red-700 font-medium text-center">This cannot be undone. Confirm?</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(selected.id)} className="flex-grow bg-red-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-red-700">Confirm Delete</button>
                    <button onClick={() => setDeleteConfirm(null)} className="flex-grow border border-gray-200 text-gray-600 font-bold py-2 rounded-lg text-xs hover:bg-white">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
