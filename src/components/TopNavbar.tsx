import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ChevronDown, 
  MessageSquare,
  Sparkles,
  CheckCheck,
  X
} from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    theme,
    toggleTheme,
    currentWorkspace,
    setCurrentWorkspace,
    workspaces,
    notifications,
    markNotificationsAsRead,
    clearNotification,
    conversations
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  // Avoid rendering navbar on landing and auth pages
  if (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register' || currentPage === 'workspace-select') {
    return null;
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30 select-none">
      
      {/* Left: Workspace Selector */}
      <div className="relative">
        <button
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-background/50 hover:bg-accent/80 transition-all font-semibold text-sm text-foreground cursor-pointer"
        >
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span>{currentWorkspace}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
        </button>

        {showWorkspaceMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowWorkspaceMenu(false)} />
            <div className="absolute left-0 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg z-20 animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase px-3 py-1.5">Select Workspace</p>
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  onClick={() => {
                    setCurrentWorkspace(ws);
                    setShowWorkspaceMenu(false);
                    setCurrentPage('dashboard');
                  }}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between
                    ${currentWorkspace === ws 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-foreground/80 hover:bg-accent'
                    }
                  `}
                >
                  <span>{ws}</span>
                  {currentWorkspace === ws && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </button>
              ))}
              <div className="border-t border-border/40 my-1" />
              <button
                onClick={() => {
                  setShowWorkspaceMenu(false);
                  setCurrentPage('workspace-select');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Manage Workspaces
              </button>
            </div>
          </>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="hidden lg:flex items-center max-w-md w-full relative">
        <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground/80 pointer-events-none" />
        <input
          type="text"
          placeholder="Search projects, tasks, comments (Press ⌘K)..."
          className="w-full h-9 pl-10 pr-4 rounded-xl glass-input text-xs placeholder:text-muted-foreground/50 border-border/60"
        />
        <div className="absolute right-3 px-1.5 py-0.5 rounded border border-border bg-muted/60 text-[10px] font-bold text-muted-foreground select-none pointer-events-none">
          ⌘K
        </div>
      </div>

      {/* Right: User Actions */}
      <div className="flex items-center gap-3">
        {/* Toggle Theme */}
        <button
          onClick={toggleTheme}
          className="h-9 w-9 rounded-xl border border-border bg-background/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-yellow-400" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Chat Messages Shortcut */}
        <button
          onClick={() => setCurrentPage('messages')}
          className="h-9 w-9 rounded-xl border border-border bg-background/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer relative"
          title="Messages"
        >
          <MessageSquare className="h-4.5 w-4.5" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="h-9 w-9 rounded-xl border border-border bg-background/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer relative"
            title="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-error text-white text-[9px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-card p-2 shadow-lg z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 mb-1.5">
                  <span className="text-xs font-bold text-foreground">Notifications</span>
                  {unreadNotifications > 0 && (
                    <button
                      onClick={markNotificationsAsRead}
                      className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="h-3 w-3" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`
                          p-2.5 rounded-lg border border-transparent hover:bg-accent transition-colors text-left flex items-start justify-between gap-2
                          ${!n.read ? 'bg-primary/5 border-primary/10' : ''}
                        `}
                      >
                        <div className="flex-1">
                          <p className="text-xs font-bold text-foreground leading-tight flex items-center gap-1.5">
                            {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                            {n.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">{n.description}</p>
                          <span className="text-[9px] text-muted-foreground/60 block mt-1">{n.timestamp}</span>
                        </div>
                        <button
                          onClick={() => clearNotification(n.id)}
                          className="text-muted-foreground/60 hover:text-foreground shrink-0 rounded p-0.5 hover:bg-background transition-colors cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar */}
        <button
          onClick={() => setCurrentPage('profile')}
          className="h-9 w-9 rounded-xl overflow-hidden border border-border bg-accent/60 flex items-center justify-center hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer"
          title="My Profile"
        >
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
            alt="User Profile"
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
