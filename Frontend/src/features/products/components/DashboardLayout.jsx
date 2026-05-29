import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { House, LayoutDashboard, Package, Plus, ClipboardList, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useTheme } from '../../../app/ThemeContext.jsx'; // standalone localStorage hook

const DashboardLayout = () => {
  const { handleLogout } = useAuth();
  const isInitialized = useSelector((state) => state.auth.isInitialized);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center space-y-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg"></div>
          <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">RUGGED<span className="text-[var(--text-secondary)]">FIT</span></span>
        </div>
        <div className="w-12 h-12 border-4 border-[var(--border-subtle)] border-t-[var(--color-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Products', path: '/dashboard/products', icon: <Package size={20} />, exact: false },
    { name: 'Add Product', path: '/dashboard/create-product', icon: <Plus size={20} />, exact: false },
    { name: 'Orders', path: '/dashboard/orders', icon: <ClipboardList size={20} />, exact: false },
  ];

  const isRouteActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] selection:bg-[var(--color-accent)] selection:text-black">

      {/* Mobile Header */}
      <header className="lg:hidden h-16 bg-[var(--color-primary)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4 sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xs">RF</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">RUGGED<span className="text-[var(--text-secondary)]">FIT</span></span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-[var(--text-primary)]"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar Overlay (Mobile Only) */}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[70] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[var(--color-primary)] border-r border-[var(--border-subtle)] flex flex-col z-[80] transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-black font-bold text-xs">RF</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">RUGGED<span className="text-[var(--text-secondary)]">FIT</span></span>
          </div>
          <button
            className="lg:hidden p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4 px-4">Menu</div>
          {navItems.map((item) => {
            const active = isRouteActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${active
                  ? 'bg-[var(--color-accent)] text-black shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--text-primary)]'
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* User / Settings / Logout */}
        <div className="p-4 border-t border-[var(--border-subtle)] space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:bg-[var(--color-background)] hover:text-[var(--text-primary)] rounded-xl transition-colors font-medium"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
