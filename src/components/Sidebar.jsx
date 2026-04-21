import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const navItems = [
    {
      path: '/',
      label: 'Articles',
      icon: LayoutDashboard,
      show: true
    },
    {
      path: '/my-articles',
      label: 'My Articles',
      icon: FileText,
      show: user && (user.role === 'admin' || user.role === 'editor')
    },
    {
      path: '/logs',
      label: 'Audit Logs',
      icon: Settings,
      show: user && (user.role === 'admin' || user.role === 'editor')
    },
    {
      path: '/admin/articles',
      label: 'Manage Articles',
      icon: FileText,
      show: user && user.role === 'admin'
    },
    {
      path: '/users',
      label: 'Manage Users',
      icon: Users,
      show: user && user.role === 'admin'
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 glass border-r border-zinc-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo/Brand */}
        <div className="px-6 py-4 border-b border-zinc-200">
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            ArticleHub
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.filter(item => item.show).map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  font-medium transition-all
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-text-secondary hover:bg-zinc-100 hover:text-text-primary'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        {user && (
          <div className="p-4 border-t border-zinc-200">
            <div className="flex items-center gap-3 px-4 py-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger font-medium hover:bg-danger/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
