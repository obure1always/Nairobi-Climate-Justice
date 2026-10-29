import React, { useState } from 'react';
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
  BookA,
  Tv,
  Menu,
  X,
  FileCheck,
  Database,
  Globe2,
  Award,
  GraduationCap,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isSwahili = language === 'sw';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Desktop sidebar navigation items
  const isStaff = user?.role === 'instructor' || user?.role === 'admin';
  const mainNavItems = [
    { to: '/', icon: LayoutDashboard, label: isSwahili ? 'Dashibodi' : 'Dashboard' },
    { to: '/pathways', icon: Compass, label: isSwahili ? 'Njia za Masomo (6)' : 'Pathways (6)' },
    { to: '/learn', icon: BookOpen, label: isSwahili ? 'Mtaala wa Moduli' : 'Curriculum' },
    { to: '/projects', icon: FileCheck, label: isSwahili ? 'Miradi ya Vitendo' : 'Applied Projects', badge: 'Rubric' },
    { to: '/climate-data', icon: Database, label: isSwahili ? 'Data ya Tabianchi' : 'Climate Data & Maps' },
    { to: '/case-studies', icon: Globe2, label: isSwahili ? 'Mifano ya Kenya' : 'Kenyan Case Studies' },
    { to: '/impact', icon: Award, label: isSwahili ? 'Athari Halisi' : 'Impact Tracker' },
    ...(isStaff ? [{ to: '/instructor', icon: GraduationCap, label: isSwahili ? 'Studio ya Mwalimu' : 'Instructor Studio', badge: 'Staff' }] : []),
    { to: '/awareness', icon: Tv, label: isSwahili ? 'Uelewa wa Video' : 'Awareness (Videos)', badge: isSwahili ? 'Video' : 'Videos' },
    { to: '/buddy', icon: Bot, label: isSwahili ? 'Climate Buddy' : 'Climate Buddy' },
    { to: '/scenarios', icon: Compass, label: isSwahili ? 'Matukio (14)' : 'Scenarios (14)' },
    { to: '/action-guides', icon: ClipboardCheck, label: isSwahili ? 'Miongozo (7)' : 'Action Guides (7)' },
    { to: '/glossary', icon: BookA, label: isSwahili ? 'Kamusi (70+)' : 'Glossary (70+)' },
    { to: '/resources', icon: FolderOpen, label: isSwahili ? 'Rasilimali' : 'Resources' }
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
    { to: '/awareness', icon: Tv, label: isSwahili ? 'Video' : 'Videos' },
    { to: '/buddy', icon: Bot, label: isSwahili ? 'Buddy' : 'Buddy' },
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

      {/* Mobile Drawer Modal (Hub for Scenarios, Guides, Glossary, Resources) */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end transition-opacity"
          role="dialog"
          aria-modal="true"
          aria-label={isSwahili ? 'Menyu Kamili ya Mafunzo' : 'Complete Learning Hub'}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto p-6 pb-24 shadow-2xl space-y-4 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <h3 className="font-bold text-gray-900 text-base">
                  {isSwahili ? 'Vituo vya Mafunzo' : 'Learning Hub'}
                </h3>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                aria-label={isSwahili ? 'Funga menyu' : 'Close menu'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {[
                { to: '/climate-data', icon: Database, label: isSwahili ? 'Data na Ramani' : 'Climate Maps', color: 'text-teal-600 bg-teal-50' },
                { to: '/case-studies', icon: Globe2, label: isSwahili ? 'Mifano ya Kenya' : 'Kenyan Cases', color: 'text-emerald-700 bg-emerald-50' },
                { to: '/scenarios', icon: Compass, label: isSwahili ? 'Matukio (14)' : 'Scenarios (14)', color: 'text-amber-600 bg-amber-50' },
                { to: '/action-guides', icon: ClipboardCheck, label: isSwahili ? 'Miongozo (7)' : 'Action Guides (7)', color: 'text-blue-600 bg-blue-50' },
                { to: '/glossary', icon: BookA, label: isSwahili ? 'Kamusi (70+)' : 'Glossary (70+)', color: 'text-purple-600 bg-purple-50' },
                { to: '/resources', icon: FolderOpen, label: isSwahili ? 'Rasilimali (18)' : 'Resources (18)', color: 'text-emerald-600 bg-emerald-50' },
                { to: '/progress', icon: Trophy, label: isSwahili ? 'Maendeleo' : 'Progress', color: 'text-orange-600 bg-orange-50' },
                { to: '/awareness', icon: Tv, label: isSwahili ? 'Video za Tabianchi' : 'Awareness Videos', color: 'text-red-600 bg-red-50' }
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-white transition-all text-xs font-bold text-gray-800"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-forest-green font-medium">
                {isSwahili ? 'Kuhusu' : 'About'}
              </Link>
              <span>•</span>
              <Link to="/help" onClick={() => setMobileMenuOpen(false)} className="hover:text-forest-green font-medium">
                {isSwahili ? 'Msaada' : 'Help & FAQ'}
              </Link>
              <span>•</span>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="hover:text-forest-green font-medium">
                {isSwahili ? 'Akaunti' : 'Account'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar (hidden on desktop) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 pb-safe z-40 shadow-lg"
        aria-label="Mobile Navigation"
      >
        <div className="flex justify-around items-center h-16 px-1">
          {mobileNavItems.slice(0, 4).map((item) => (
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

          {/* More Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all",
              mobileMenuOpen ? "text-forest-green font-bold" : "text-gray-500 hover:text-gray-900"
            )}
            aria-expanded={mobileMenuOpen}
            aria-label={isSwahili ? 'Menyu zaidi' : 'More menu'}
          >
            <Menu className="w-5 h-5 shrink-0" />
            <span className="text-[10px] tracking-tight">{isSwahili ? 'Zaidi' : 'More'}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
