import React, { useState, useEffect } from 'react';
import { FileText, Image, Calendar, Inbox, TrendingUp, Eye, EyeOff, Clock, ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
  pages: number;
  blogPosts: number;
  publishedPosts: number;
  draftPosts: number;
  mediaFiles: number;
  events: number;
  publishedEvents: number;
  submissions: number;
  unreadSubmissions: number;
  recentSubmissions: { name: string; email: string; submitted_at: string }[];
  recentPosts: { title_en: string; slug: string; is_published: boolean; created_at: string }[];
}

const StatCard = ({ icon, label, value, sub, color, link }: { icon: React.ReactNode; label: string; value: number | string; sub?: string; color: string; link?: string }) => {
  const inner = (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {link && <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />}
      </div>
      <div className="text-3xl font-bold text-gray-900 tabular-nums">{value}</div>
      <div className="text-sm font-medium text-gray-500 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-2 font-medium">{sub}</div>}
    </div>
  );
  return link ? <Link to={link}>{inner}</Link> : inner;
};

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError('Could not load dashboard stats. Make sure the server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const timeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-9 bg-gray-100 rounded-lg w-72 animate-pulse mb-2" />
          <div className="h-4 bg-gray-100 rounded w-48 animate-pulse" />
        </div>
        <div className="grid grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-36 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p className="text-red-700 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-sm text-red-600 underline">Retry</button>
      </div>
    );
  }

  const s = stats!;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-serif italic text-gray-900">Overview</h1>
          <p className="text-gray-400 mt-1 text-sm">Cap Bon 2028 — Content Management</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      {/* Alert for unread messages */}
      {s.unreadSubmissions > 0 && (
        <Link to="/admin/dashboard/submissions" className="block bg-red-600 text-white rounded-2xl px-6 py-4 flex items-center gap-4 hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Inbox size={20} />
          </div>
          <div className="flex-grow">
            <div className="font-bold">You have {s.unreadSubmissions} unread message{s.unreadSubmissions > 1 ? 's' : ''}</div>
            <div className="text-red-200 text-sm">Click to view contact submissions</div>
          </div>
          <ArrowRight size={20} className="text-white/60" />
        </Link>
      )}

      {/* Stats Grid */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Content Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<FileText size={20} className="text-blue-600" />} label="Total Pages" value={s.pages} color="bg-blue-50" link="/admin/dashboard/pages" />
          <StatCard icon={<TrendingUp size={20} className="text-green-600" />} label="Blog Posts" value={s.blogPosts} sub={`${s.publishedPosts} published · ${s.draftPosts} drafts`} color="bg-green-50" link="/admin/dashboard/blog" />
          <StatCard icon={<Image size={20} className="text-purple-600" />} label="Media Files" value={s.mediaFiles} color="bg-purple-50" link="/admin/dashboard/media" />
          <StatCard icon={<Calendar size={20} className="text-orange-600" />} label="Events" value={s.events} sub={`${s.publishedEvents} published`} color="bg-orange-50" link="/admin/dashboard/events" />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Engagement</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Inbox size={20} className="text-red-600" />} label="Unread Messages" value={s.unreadSubmissions} color="bg-red-50" link="/admin/dashboard/submissions" />
          <StatCard icon={<Users size={20} className="text-teal-600" />} label="Total Submissions" value={s.submissions} color="bg-teal-50" link="/admin/dashboard/submissions" />
          <StatCard icon={<Eye size={20} className="text-indigo-600" />} label="Published Posts" value={s.publishedPosts} color="bg-indigo-50" link="/admin/dashboard/blog" />
          <StatCard icon={<EyeOff size={20} className="text-gray-600" />} label="Draft Posts" value={s.draftPosts} color="bg-gray-100" link="/admin/dashboard/blog" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-8">
        {/* Recent Submissions */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Messages</h3>
            <Link to="/admin/dashboard/submissions" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {s.recentSubmissions.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No messages yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {s.recentSubmissions.map((sub, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">
                    {sub.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{sub.name}</div>
                    <div className="text-xs text-gray-400 truncate">{sub.email}</div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                    <Clock size={10} />
                    {timeAgo(sub.submitted_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Blog Posts</h3>
            <Link to="/admin/dashboard/blog" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {s.recentPosts.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No posts yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {s.recentPosts.map((post, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${post.is_published ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div className="flex-grow min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{post.title_en}</div>
                    <div className="text-xs text-gray-400">{post.is_published ? 'Published' : 'Draft'}</div>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">{formatDate(post.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'New Blog Post', to: '/admin/dashboard/blog', icon: <FileText size={16} /> },
            { label: 'Upload Media', to: '/admin/dashboard/media', icon: <Image size={16} /> },
            { label: 'Create Event', to: '/admin/dashboard/events', icon: <Calendar size={16} /> },
            { label: 'View Messages', to: '/admin/dashboard/submissions', icon: <Inbox size={16} /> },
          ].map((a) => (
            <Link key={a.label} to={a.to} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-3 hover:border-red-200 hover:bg-red-50 transition-all group">
              <div className="w-8 h-8 bg-gray-100 group-hover:bg-red-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:text-red-600 transition-colors">
                {a.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-red-700 transition-colors">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
