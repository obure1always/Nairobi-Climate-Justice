import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  HelpCircle, 
  User, 
  Info, 
  FolderOpen, 
  Bot, 
  Compass, 
  ClipboardCheck,
  BookA
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isSwahili = language === 'sw';

  // Desktop sidebar navigation items
  const mainNavItems = [
    { to: '/', icon: Home, label: isSwahili ? 'Mwanzo' : 'Home' },
    { to: '/learn', icon: BookOpen, label: isSwahili ? 'Mtaala' : 'Curriculum' },
    { to: '/buddy', icon: Bot, label: isSwahili ? 'Climate Buddy' : 'Climate Buddy', badge: isSwahili ? 'Bure' : 'Offline' },
    { to: '/scenarios', icon: Compass, label: isSwahili ? 'Matukio (14)' : 'Scenarios (14)' },
    { to: '/action-guides', icon: ClipboardCheck, label: isSwahili ? 'Miongozo (7)' : 'Action Guides (7)' },
    { to: '/glossary', icon: BookA, label: isSwahili ? 'Kamusi (70+)' : 'Glossary (70+)' },
    { to: '/resources', icon: FolderOpen, label: isSwahili ? 'Rasilimali (18)' : 'Resources (18)' },
    { to: '/progress', icon: Trophy, label: isSwahili ? 'Maendeleo' : 'Progress' }
  ];

  const secondaryNavItems = [
    { to: '/profile', icon: User, label: isSwahili ? 'Profaili na Akaunti' : 'Profile & Account' },
    { to: '/about', icon: Info, label: isSwahili ? 'Kuhusu' : 'About' },
    { to: '/help', icon: HelpCircle, label: isSwahili ? 'Msaada' : 'Help' }
  ];

  // Mobile bottom bar items (5 essential navigation hubs)
  const mobileNavItems = [
    { to: '/', icon: Home, label: isSwahili ? 'Mwanzo' : 'Home' },
    { to: '/learn', icon: BookOpen, label: isSwahili ? 'Masomo' : 'Learn' },
    { to: '/buddy', icon: Bot, label: isSwahili ? 'Buddy' : 'Buddy' },
    { to: '/scenarios', icon: Compass, label: isSwahili ? 'Matukio' : 'Scenarios' },
    { to: user ? '/profile' : '/login', icon: User, label: user ? (isSwahili ? 'Akaunti' : 'Account') : (isSwahili ? 'Ingia' : 'Sign In') }
  ];

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 bg-white sticky top-0 overflow-y-auto">
        <div className="p-6 pb-3">
          <span className="text-[10px] font-bold tracking-widest text-forest-green uppercase px-2 py-0.5 rounded-full bg-forest-green/10">
            Nairobi Climate Justice
          </span>
          <h1 className="text-xl font-black text-gray-900 mt-1">
            Climate Justice
          </h1>
        </div>

        {/* User / Guest Status Banner */}
        <div className="px-4 mb-3">
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/70 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-forest-green text-white flex items-center justify-center font-bold text-xs shrink-0">
                {(user.displayName || user.name || user.email || 'U')[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {user.displayName || user.name || user.email?.split('@')[0]}
                </p>
                <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {isSwahili ? 'Imeunganishwa' : 'Cloud Sync Active'}
                </p>
              </div>
            </Link>
          ) : (
            <div className="p-2.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                  <span>🌿</span> {isSwahili ? 'Hali ya Mgeni' : 'Guest Mode'}
                </p>
                <p className="text-[10px] text-gray-500">
                  {isSwahili ? 'Kifaa hiki tu' : 'Local device only'}
                </p>
              </div>
              <Link
                to="/login"
                className="px-2.5 py-1 bg-forest-green hover:bg-forest-green/90 text-white text-[11px] font-bold rounded-lg transition-all"
              >
                {isSwahili ? 'Ingia' : 'Sign In'}
              </Link>
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 pb-6">
          <div className="pt-2 pb-1">
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {isSwahili ? 'Mafunzo ya Tabianchi' : 'Learning Hub'}
            </p>
          </div>

          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all",
                  isActive 
                    ? "bg-forest-green/10 text-forest-green font-bold shadow-sm" 
                    : "text-gray-600 hover:bg-gray-100/70 hover:text-gray-900"
                )
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
          
          <div className="pt-5 pb-1">
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {isSwahili ? 'Zaidi' : 'Account & Info'}
            </p>
          </div>
          
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-gray-100 text-gray-900 font-bold" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Bar (hidden on desktop) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 pb-safe z-50 shadow-lg"
        aria-label="Mobile Navigation"
      >
        <div className="flex justify-around items-center h-16 px-1">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all",
                  isActive ? "text-forest-green font-bold" : "text-gray-500 hover:text-gray-900"
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};
