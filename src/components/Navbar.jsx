import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Search, X, User as UserIcon, LogIn, UserPlus } from 'lucide-react';

const Navbar = ({ onMenuClick, isMobileMenuOpen }) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <nav className="glass sticky top-0 z-40 w-full px-4 lg:px-6 py-4 flex items-center justify-between border-b border-zinc-200">
      {/* Left: Hamburger menu for mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-zinc-100 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Brand - hidden on mobile, shown on desktop only when not logged in */}
        {!user && (
          <Link to="/" className="hidden lg:flex items-center gap-2 text-lg font-bold text-text-primary">
            <UserIcon className="w-6 h-6 text-primary" />
            ArticleHub
          </Link>
        )}
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 max-w-xl mx-2 sm:mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search articles..."
            className="w-full h-10 pl-10 pr-10 rounded-lg bg-white border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right: User icon or auth buttons */}
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold">{user.name}</span>
              <span className="text-xs text-zinc-500 capitalize">{user.role}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <UserIcon className="w-5 h-5" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              to="/login" 
              className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-primary transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <Link 
              to="/register" 
              className="px-3 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
