import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardLayout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PagesManager from './pages/PagesManager';
import BlogManager from './pages/BlogManager';
import MediaLibrary from './pages/MediaLibrary';
import Submissions from './pages/Submissions';
import EventsManager from './pages/EventsManager';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('admin_token'));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('admin_token', token);
    setIsAuthenticated(true);
    setTimeout(() => navigate('/admin/dashboard'), 100);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    navigate('/admin/login');
  };

  return (
    <Routes>
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/admin/dashboard/*"
        element={
          isAuthenticated ? (
            <DashboardLayout onLogout={handleLogout}>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="pages" element={<PagesManager />} />
                <Route path="blog" element={<BlogManager />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="events" element={<EventsManager />} />
                <Route path="submissions" element={<Submissions />} />
              </Routes>
            </DashboardLayout>
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;
