import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, X, Search, CheckCircle } from 'lucide-react';

interface Media {
  id: number;
  filename: string;
  url: string;
  original_name: string;
  mime_type: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  selectedId?: number | null;
}

const MediaPicker: React.FC<Props> = ({ isOpen, onClose, onSelect, selectedId }) => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchMedia();
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      setMediaList(data);
    } catch (err) {
      console.error('Failed to fetch media');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: formData
      });
      if (res.ok) {
        fetchMedia();
      }
    } catch (err) {
      console.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter(m => 
    m.original_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Media Library</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-4 bg-gray-50 border-b border-gray-100 flex gap-4 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search images..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-red-500 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <label className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 cursor-pointer hover:bg-red-700 transition-colors">
            <Upload size={16} />
            {isUploading ? 'Uploading...' : 'Upload New'}
            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          </label>
        </div>

        <div className="flex-grow p-6 overflow-y-auto">
          {loading ? (
            <div className="h-full flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p>No media found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelect(m)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                    selectedId === m.id ? 'border-red-600 shadow-lg ring-4 ring-red-50' : 'border-transparent hover:border-red-200'
                  }`}
                >
                  <img src={m.url} alt={m.original_name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold px-2 py-1 bg-black/60 rounded">Select</span>
                  </div>
                  {selectedId === m.id && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow-md">
                      <CheckCircle className="text-red-600" size={20} />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white text-[10px] truncate">
                    {m.original_name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MediaPicker;
