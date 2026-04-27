import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Calendar, MapPin, Eye, EyeOff, Save, X, Search, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import MediaPicker from '../components/MediaPicker';

interface Event {
  id?: number;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  location: string;
  start_date: string;
  end_date: string;
  cover_image_id: number | null;
  cover_url?: string;
  is_published: boolean;
}

const emptyEvent = (): Event => ({
  title_en: '', title_fr: '', description_en: '', description_fr: '',
  location: '', start_date: '', end_date: '', cover_image_id: null, is_published: false
});

const EventsManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [editing, setEditing] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'fr'>('en');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch { showToast('Failed to load events', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title_en || !editing.title_fr) {
      showToast('Title in both EN and FR is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const isNew = !editing.id;
      const url = isNew ? '/api/events' : `/api/events/${editing.id}`;
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: JSON.stringify(editing)
      });
      if (!res.ok) throw new Error('Save failed');
      showToast(isNew ? 'Event created!' : 'Event updated!');
      setEditing(null);
      fetchEvents();
    } catch { showToast('Failed to save event', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      if (!res.ok) throw new Error();
      showToast('Event deleted');
      setDeleteConfirm(null);
      fetchEvents();
    } catch { showToast('Failed to delete event', 'error'); }
  };

  const togglePublish = async (event: Event) => {
    if (!event.id) return;
    try {
      await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: JSON.stringify({ ...event, is_published: !event.is_published })
      });
      fetchEvents();
    } catch { showToast('Failed to update status', 'error'); }
  };

  const formatDateRange = (start: string, end: string) => {
    if (!start) return 'No date set';
    const s = new Date(start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (!end) return s;
    const e = new Date(end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${s} → ${e}`;
  };

  const filtered = events.filter(e => {
    const matchSearch = e.title_en.toLowerCase().includes(search.toLowerCase()) || e.title_fr.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'published' ? e.is_published : !e.is_published);
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex gap-8 h-full">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-white text-sm font-medium ${toast.type === 'success' ? 'bg-gray-900' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Left: Event List */}
      <div className="w-96 flex-shrink-0 flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-serif italic text-gray-900">Events</h1>
            <p className="text-gray-400 mt-1 text-sm">{events.length} total · {events.filter(e => e.is_published).length} published</p>
          </div>
          <button onClick={() => setEditing(emptyEvent())} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-colors text-sm">
            <Plus size={16} /> New Event
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-red-400">
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        <div className="flex-grow overflow-y-auto space-y-2">
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-28 animate-pulse" />)
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
              <Calendar size={32} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-500 font-medium text-sm">No events found</p>
              <button onClick={() => setEditing(emptyEvent())} className="mt-3 text-red-600 text-sm font-bold hover:text-red-700">Create your first event →</button>
            </div>
          ) : filtered.map((event) => (
            <div
              key={event.id}
              onClick={() => setEditing({ ...event })}
              className={`group bg-white border rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all ${editing?.id === event.id ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-100 hover:border-gray-200'}`}
            >
              {event.cover_url && (
                <div className="w-full h-24 rounded-xl overflow-hidden mb-3 bg-gray-100">
                  <img src={event.cover_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 text-sm truncate">{event.title_en}</div>
                  <div className="text-xs text-gray-400 italic truncate">{event.title_fr}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={10} />
                      {formatDateRange(event.start_date, event.end_date)}
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <MapPin size={10} />
                      {event.location}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${event.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {event.is_published ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); togglePublish(event); }} className="flex-grow flex items-center justify-center gap-1 border border-gray-200 text-gray-500 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                  {event.is_published ? <><EyeOff size={12} /> Unpublish</> : <><Eye size={12} /> Publish</>}
                </button>
                {deleteConfirm === event.id ? (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(event.id!); }} className="flex-grow bg-red-600 text-white py-1.5 rounded-lg text-xs font-bold">Confirm</button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }} className="flex-grow border border-gray-200 text-gray-500 py-1.5 rounded-lg text-xs font-bold">Cancel</button>
                  </>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(event.id!); }} className="p-1.5 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Edit Panel */}
      <div className="flex-grow">
        {!editing ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-16 bg-white border border-dashed border-gray-200 rounded-2xl">
            <Calendar size={48} className="text-gray-200 mb-4" />
            <h3 className="text-gray-500 font-bold text-lg">Select or create an event</h3>
            <p className="text-gray-400 text-sm mt-1">Click on an event to edit it, or create a new one</p>
            <button onClick={() => setEditing(emptyEvent())} className="mt-6 flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-colors">
              <Plus size={18} /> Create New Event
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {/* Edit Header */}
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="font-bold text-gray-900">{editing.id ? 'Edit Event' : 'New Event'}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{editing.id ? `ID: ${editing.id}` : 'Fill in the details below'}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-white border border-gray-200 rounded-xl p-1">
                  <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${lang === 'en' ? 'bg-gray-900 text-white' : 'text-gray-400'}`}>EN</button>
                  <button onClick={() => setLang('fr')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${lang === 'fr' ? 'bg-gray-900 text-white' : 'text-gray-400'}`}>FR</button>
                </div>
                <button onClick={() => setEditing(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"><X size={18} /></button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Cover Image */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Cover Image</label>
                <div
                  onClick={() => setMediaPickerOpen(true)}
                  className="relative cursor-pointer group rounded-xl border-2 border-dashed border-gray-200 hover:border-red-300 transition-colors overflow-hidden"
                >
                  {editing.cover_url ? (
                    <div className="relative h-48">
                      <img src={editing.cover_url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 flex flex-col items-center justify-center gap-2">
                      <ImageIcon size={24} className="text-gray-300" />
                      <span className="text-sm text-gray-400 font-medium">Click to select cover image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Title ({lang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={lang === 'en' ? editing.title_en : editing.title_fr}
                    onChange={(e) => setEditing({ ...editing, [lang === 'en' ? 'title_en' : 'title_fr']: e.target.value })}
                    placeholder={`Event title in ${lang === 'en' ? 'English' : 'French'}...`}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-400 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Location</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} placeholder="e.g. Nabeul, Cap Bon" className="w-full pl-9 pr-4 border border-gray-200 rounded-xl py-3 focus:outline-none focus:border-red-400 text-sm transition-colors" />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Start Date</label>
                  <input type="datetime-local" value={editing.start_date?.slice(0, 16) || ''} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-400 text-sm transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">End Date</label>
                  <input type="datetime-local" value={editing.end_date?.slice(0, 16) || ''} onChange={(e) => setEditing({ ...editing, end_date: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-400 text-sm transition-colors" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Description ({lang.toUpperCase()})</label>
                <textarea
                  rows={6}
                  value={lang === 'en' ? editing.description_en : editing.description_fr}
                  onChange={(e) => setEditing({ ...editing, [lang === 'en' ? 'description_en' : 'description_fr']: e.target.value })}
                  placeholder={`Event description in ${lang === 'en' ? 'English' : 'French'}...`}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-400 text-sm resize-none transition-colors"
                />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-5 py-4">
                <div>
                  <div className="font-bold text-gray-800 text-sm">Publication Status</div>
                  <div className="text-xs text-gray-400 mt-0.5">{editing.is_published ? 'This event is live on the website' : 'This event is saved as draft'}</div>
                </div>
                <button
                  onClick={() => setEditing({ ...editing, is_published: !editing.is_published })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${editing.is_published ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editing.is_published ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <button onClick={() => setEditing(null)} className="text-gray-500 font-medium text-sm hover:text-gray-700 transition-colors">Discard changes</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Saving...' : (editing.id ? 'Save Changes' : 'Create Event')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Media Picker */}
      {mediaPickerOpen && (
        <MediaPicker
          onSelect={(media: any) => {
            setEditing(prev => prev ? { ...prev, cover_image_id: media.id, cover_url: media.url } : prev);
            setMediaPickerOpen(false);
          }}
          onClose={() => setMediaPickerOpen(false)}
        />
      )}
    </div>
  );
};

export default EventsManager;
