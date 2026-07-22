import React from 'react';
import { useApp } from '../context/AppContext';
import type { PageView } from '../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  CreditCard,
  MessageSquare,
  FolderOpen,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    setSidebarCollapsed
  } = useApp();

  const navItems: { page: PageView; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { page: 'projects', label: 'Projects', icon: <FolderKanban className="h-5 w-5" /> },
    { page: 'tasks', label: 'Tasks & Kanban', icon: <CheckSquare className="h-5 w-5" /> },
    { page: 'messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
    { page: 'files', label: 'File Manager', icon: <FolderOpen className="h-5 w-5" /> },
    { page: 'team', label: 'Team Space', icon: <Users className="h-5 w-5" /> },
    { page: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
    { page: 'billing', label: 'Billing', icon: <CreditCard className="h-5 w-5" /> },
    { page: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
    { page: 'admin', label: 'Admin Hub', icon: <ShieldAlert className="h-5 w-5" />, adminOnly: true }
  ];

  // Avoid rendering sidebar on marketing/auth pages
  if (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register' || currentPage === 'workspace-select') {
    return null;
  }

  return (
    <aside
      className={`
        hidden md:flex flex-col border-r border-border bg-card/60 backdrop-blur-md transition-all duration-300 relative z-20
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border/40">
        <div className="flex items-center gap-3 overflow-hidden select-none">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-extrabold shadow-md shadow-primary/20 shrink-0">
            A
          </div>
          {!sidebarCollapsed && (
            <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Antigravity<span className="text-primary font-bold text-xs ml-1 px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">SaaS</span>
            </span>
          )}
        </div>
        
        {/* Toggle Collapse */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute right-[-14px] top-4.5 h-7 w-7 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm hover:shadow transition-all cursor-pointer z-10"
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.page || (item.page === 'projects' && currentPage === 'project-details');
          return (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className={`
                flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer w-full group
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/15' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/80'
                }
              `}
            >
              <div className={`transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                {item.icon}
              </div>
              {!sidebarCollapsed && (
                <span className="truncate tracking-wide">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border/40 flex flex-col gap-2 bg-black/[0.02] dark:bg-white/[0.01]">
        {/* Profile Details */}
        <button 
          onClick={() => setCurrentPage('profile')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/80 transition-colors w-full text-left cursor-pointer group"
        >
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
            alt="User Avatar"
            className="h-9 w-9 rounded-xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all shrink-0"
          />
          {!sidebarCollapsed && (
            <div className="truncate flex-1">
              <p className="text-sm font-bold text-foreground leading-tight truncate">Ethan Hunt</p>
              <p className="text-xs text-muted-foreground leading-none truncate mt-0.5">ethan@acme.com</p>
            </div>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={() => {
            setCurrentPage('landing');
          }}
          className="flex items-center gap-3.5 px-4.5 py-3 rounded-xl text-sm font-semibold text-error hover:bg-error/10 transition-colors cursor-pointer w-full"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!sidebarCollapsed && <span className="tracking-wide">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
