import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Image, LogOut, Menu as MenuIcon, Inbox, Calendar, Package, X } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  onLogout: () => void;
}

const DashboardLayout: React.FC<Props> = ({ children, onLogout }) => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar_open');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setMobileMenuOpen(false);
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/contact/unread-count', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
        });
        const data = await res.json();
        setUnreadCount(data.count || 0);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar_open', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Pages', path: '/admin/dashboard/pages', icon: <MenuIcon size={18} /> },
    { label: 'Blog', path: '/admin/dashboard/blog', icon: <FileText size={18} /> },
    { label: 'Events', path: '/admin/dashboard/events', icon: <Calendar size={18} /> },
    { label: 'Products', path: '/admin/dashboard/products', icon: <Package size={18} /> },
    { label: 'Media', path: '/admin/dashboard/media', icon: <Image size={18} /> },
    { label: 'Submissions', path: '/admin/dashboard/submissions', icon: <Inbox size={18} />, badge: unreadCount },
  ];

  const currentLabel = navItems.find(i => location.pathname === i.path)?.label
    || navItems.find(i => location.pathname.startsWith(i.path) && i.path !== '/admin/dashboard')?.label
    || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex w-60 bg-white border-r border-gray-100 flex-col fixed inset-y-0 z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100">
          <div className="font-serif italic text-xl text-red-600 leading-none">Cap Bon</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Admin · 2028</div>
        </div>

        <nav className="flex-grow p-3 space-y-0.5 mt-2">
          {navItems.map((item) => {
            const isActive = item.path === '/admin/dashboard'
              ? location.pathname === '/admin/dashboard'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                  isActive ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3 text-sm font-medium">
                  {item.icon}
                  {item.label}
                </div>
                {item.badge > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-50" 
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="font-serif italic text-xl text-red-600 leading-none">Cap Bon</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Admin · 2028</div>
          </div>
          <button 
            onClick={closeMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-grow p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = item.path === '/admin/dashboard'
              ? location.pathname === '/admin/dashboard'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3 text-sm font-medium">
                  {item.icon}
                  {item.label}
                </div>
                {item.badge > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-grow min-h-screen transition-all duration-300 ${sidebarOpen ? 'md:ml-60' : 'md:ml-0'}`}>
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={isMobile ? toggleMobileMenu : () => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
              title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              {isMobile ? <MenuIcon size={20} /> : (sidebarOpen ? <X size={20} /> : <MenuIcon size={20} />)}
            </button>
            <h2 className="font-semibold text-gray-800 text-sm hidden sm:block">{currentLabel}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest hidden sm:inline">Admin</span>
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
