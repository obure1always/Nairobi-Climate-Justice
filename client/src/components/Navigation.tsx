import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Trophy, HelpCircle, User, Info, FolderOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../LanguageContext';

export const Navigation: React.FC = () => {
  const { language } = useLanguage();

  const isSwahili = language === 'sw';

  const navItems = [
    { to: '/', icon: Home, label: isSwahili ? 'Mwanzo' : 'Home' },
    { to: '/learn', icon: BookOpen, label: isSwahili ? 'Jifunze' : 'Learn' },
    { to: '/progress', icon: Trophy, label: isSwahili ? 'Maendeleo' : 'Progress' },
    { to: '/resources', icon: FolderOpen, label: isSwahili ? 'Rasilimali' : 'Resources' },
    { to: '/profile', icon: User, label: isSwahili ? 'Profaili' : 'Profile' }
  ];

  const secondaryNavItems = [
    { to: '/about', icon: Info, label: isSwahili ? 'Kuhusu' : 'About' },
    { to: '/help', icon: HelpCircle, label: isSwahili ? 'Msaada' : 'Help' },
  ];

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 bg-white sticky top-0">
        <div className="p-6">
          <h1 className="text-xl font-bold text-green-700">Climate Justice Nairobi</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive 
                    ? "bg-green-50 text-green-700" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
          
          <div className="pt-8 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">More</p>
          </div>
          
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isActive 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Bar (hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-green-600" : "text-gray-500 hover:text-gray-900"
                )
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};
