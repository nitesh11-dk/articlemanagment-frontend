import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import Dashboard from './pages/Dashboard';
import LogsPage from './pages/LogsPage';
import UsersPage from './pages/UsersPage';
import ArticleDetail from './pages/ArticleDetail';
import MyArticles from './pages/MyArticles';
import AdminArticles from './pages/AdminArticles';

// Simple loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

// Protected Route Component for generic authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;

  return children;
};

// Admin Only Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  return children;
};

const App = () => {
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-bg-primary flex flex-col lg:flex-row">
        {/* Sidebar - only shown when user is logged in */}
        {user && (
          <Sidebar 
            isOpen={mobileMenuOpen} 
            onClose={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar 
            onMenuClick={toggleMobileMenu}
          />
          <main className="flex-1">
            <Routes>
            {/* Public Routes (Accessible by Guest, Editor, Admin) */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            
            {/* Auth Routes (Only if not logged in) */}
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegistrationPage /> : <Navigate to="/" />} />

            {/* Authenticated Routes (Editor, Admin) */}
            <Route 
              path="/my-articles" 
              element={
                <ProtectedRoute>
                  <MyArticles />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/logs" 
              element={
                <ProtectedRoute>
                  <LogsPage />
                </ProtectedRoute>
              } 
            />

            {/* Admin Only Routes */}
            <Route 
              path="/admin/articles" 
              element={
                <AdminRoute>
                  <AdminArticles />
                </AdminRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              } 
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
      </div>
    </Router>
  );
};

export default App;
