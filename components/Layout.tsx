import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  CheckSquare,
  UserCircle,
  MessageSquare,
  Moon,
  Sun,
  BookOpen
} from 'lucide-react';
import { User } from '../types';
import { cn } from './ui/Components';
import { useNotifications, useTheme } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  pendingApprovals?: number;
}

const NavigationItem = ({ to, icon: Icon, label, onClick, badge }: { to: string; icon: React.ElementType; label: string; onClick?: () => void; badge?: number }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
        isActive
          ? "bg-navy-800 text-gold-400 shadow-lg shadow-navy-900/20"
          : "text-slate-300 hover:bg-navy-800/50 hover:text-white"
      )
    }
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </div>
    {badge !== undefined && badge > 0 && (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
        {badge > 99 ? '99+' : badge}
      </span>
    )}
  </NavLink>
);

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, pendingApprovals = 0 }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Dashboard';
    // Handle nested paths like staff/create
    const mainSection = path.split('/')[0];
    return mainSection.charAt(0).toUpperCase() + mainSection.slice(1);
  };

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex transition-colors duration-200">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-navy-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-auto shadow-2xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-900 font-serif font-bold text-xl">
                N
              </div>
              <span className="font-serif text-2xl font-semibold tracking-tight">Nexus</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="mb-6 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Main Menu
            </div>
            
            <NavigationItem to="/" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
            <NavigationItem to="/policies" icon={BookOpen} label="Policies" onClick={() => setIsSidebarOpen(false)} />
            <NavigationItem to="/profile" icon={UserCircle} label="My Profile" onClick={() => setIsSidebarOpen(false)} />
            <NavigationItem to="/complaints" icon={MessageSquare} label="Help Desk" onClick={() => setIsSidebarOpen(false)} />
            
            {/* Role Based Links */}
            {(user.role === 'hr' || user.role === 'admin') && (
              <>
                 <div className="mt-8 mb-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Management
                </div>
                <NavigationItem to="/staff" icon={Users} label="Staff Directory" onClick={() => setIsSidebarOpen(false)} />
                <NavigationItem 
                  to="/approvals" 
                  icon={CheckSquare} 
                  label="Approvals" 
                  badge={pendingApprovals}
                  onClick={() => setIsSidebarOpen(false)} 
                />
              </>
            )}

            <NavigationItem to="/documents" icon={FileText} label="My Documents" onClick={() => setIsSidebarOpen(false)} />

            {user.role === 'admin' && (
              <>
                 <div className="mt-8 mb-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  System
                </div>
                <NavigationItem to="/settings" icon={Settings} label="Settings" onClick={() => setIsSidebarOpen(false)} />
              </>
            )}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-navy-800">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-navy-800/50 mb-3">
              <img 
                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=fbbf24&color=0f172a`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-navy-700"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-400 truncate capitalize">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-serif font-medium text-navy-900 dark:text-white hidden sm:block">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className="p-2 text-slate-400 hover:text-gold-500 transition-colors focus:outline-none rounded-lg hover:bg-slate-50 dark:hover:bg-navy-800"
                aria-label="Toggle Theme"
            >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
                <button 
                  className="relative p-2 text-slate-400 hover:text-navy-900 dark:hover:text-white transition-colors focus:outline-none"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-navy-900 animate-pulse"></span>
                  )}
                </button>

                {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-navy-800 rounded-xl shadow-2xl border border-slate-100 dark:border-navy-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-slate-50 dark:border-navy-700 flex justify-between items-center bg-slate-50/50 dark:bg-navy-800">
                            <h3 className="font-medium text-navy-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button 
                                  onClick={markAllAsRead}
                                  className="text-xs text-gold-600 hover:text-gold-700 dark:text-gold-500 dark:hover:text-gold-400 font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50 dark:divide-navy-700">
                                    {notifications.map((notification) => (
                                        <div 
                                          key={notification.id} 
                                          onClick={() => markAsRead(notification.id)}
                                          className={`p-4 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors cursor-pointer flex gap-3 ${!notification.read ? 'bg-blue-50/30 dark:bg-navy-700/50' : ''}`}
                                        >
                                            <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-gold-500' : 'bg-transparent'}`}></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className={`text-sm ${!notification.read ? 'font-semibold text-navy-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">{notification.date}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{notification.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-2 border-t border-slate-50 dark:border-navy-700 bg-slate-50/30 dark:bg-navy-800 text-center">
                            <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white font-medium">View All History</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-navy-800 rounded-full">
              <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize">{user.status}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};