import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Archive, Inbox, CheckCircle, ExternalLink, Calendar, User, Clock } from 'lucide-react';

interface Submission {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  submitted_at: string;
}

const Submissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('unread');
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact/submissions?filter=${filter}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: 'read' | 'archive' | 'delete') => {
    try {
      const method = action === 'delete' ? 'DELETE' : 'PUT';
      const endpoint = action === 'delete' 
        ? `/api/contact/submissions/${id}` 
        : `/api/contact/submissions/${id}/${action}`;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
      });

      if (res.ok) {
        if (selectedSubmission?.id === id) {
          if (action === 'delete' || action === 'archive') setSelectedSubmission(null);
          else setSelectedSubmission({ ...selectedSubmission, is_read: true });
        }
        fetchSubmissions();
      }
    } catch (err) {
      console.error(`Failed to ${action} submission`);
    }
  };

  const openSubmission = (s: Submission) => {
    setSelectedSubmission(s);
    if (!s.is_read) handleAction(s.id, 'read');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif italic text-gray-900">Submissions</h1>
          <p className="text-gray-500 mt-1">Management of contact form messages</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          {(['unread', 'all', 'archived'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 text-sm font-bold capitalize rounded-lg transition-all ${
                filter === f ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* List */}
        <div className="flex-grow bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <Inbox size={32} className="text-red-500 opacity-20" />
              </div>
              <p className="text-gray-900 font-bold">No submissions found</p>
              <p className="text-gray-400 text-sm mt-1 max-w-[280px]">
                {filter === 'unread' ? 'All caught up — no unread messages.' : 'Nothing here yet. messages from the contact form will appear here.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {submissions.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => openSubmission(s)}
                  className={`group p-6 flex items-center gap-6 cursor-pointer hover:bg-gray-50 transition-all ${
                    selectedSubmission?.id === s.id ? 'bg-red-50/50' : ''
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-transform ${s.is_read ? 'bg-transparent' : 'bg-red-600 scale-125'}`} />
                  
                  <div className="w-48 overflow-hidden">
                    <div className="font-bold text-gray-900 text-sm truncate">{s.name}</div>
                    <div className="text-xs text-gray-400 truncate">{s.email}</div>
                  </div>

                  <div className="flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-1">{s.message}</p>
                  </div>

                  <div className="text-right w-40">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{formatDate(s.submitted_at)}</div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAction(s.id, 'archive'); }}
                      className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-red-600 transition-all"
                      title="Archive"
                    >
                      <Archive size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAction(s.id, 'delete'); }}
                      className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-red-600 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedSubmission && (
          <div className="w-[450px] bg-white border border-gray-200 rounded-2xl shadow-xl sticky top-24 overflow-hidden animate-in fade-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-gray-100 relative">
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-300 transition-colors"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {selectedSubmission.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-none">{selectedSubmission.name}</h3>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-red-600 text-sm hover:underline flex items-center gap-1 mt-1">
                    {selectedSubmission.email}
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                  <Calendar size={14} className="text-gray-400" />
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{formatDate(selectedSubmission.submitted_at).split(' ')[0]}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                  <Clock size={14} className="text-gray-400" />
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{formatDate(selectedSubmission.submitted_at).split(' ')[1]}</div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white min-h-[200px]">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Message Body</div>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedSubmission.message}</p>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
              <a 
                href={`mailto:${selectedSubmission.email}?subject=Re: Your message to Cap Bon Discover`}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-100 flex items-center justify-center gap-2 hover:bg-red-700 transition-all"
              >
                <Mail size={18} />
                Reply by Email
              </a>
              <div className="flex gap-3">
                {!selectedSubmission.is_archived && (
                  <button 
                    onClick={() => handleAction(selectedSubmission.id, 'archive')}
                    className="flex-grow bg-white border border-gray-200 text-gray-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                  >
                    <Archive size={18} />
                    Archive
                  </button>
                )}
                <button 
                  onClick={() => handleAction(selectedSubmission.id, 'delete')}
                  className="flex-grow bg-white border border-gray-200 text-gray-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                >
                  <Trash2 size={18} />
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const X = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default Submissions;
