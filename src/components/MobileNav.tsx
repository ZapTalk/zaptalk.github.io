import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function MobileNav() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    {
      to: '/',
      icon: Home,
      label: t('nav.home') || 'Home',
      match: (path: string) => path === '/',
    },
    {
      to: '/catalog',
      icon: BookOpen,
      label: t('nav.catalog') || 'Catalog',
      match: (path: string) => path.startsWith('/catalog'),
    },
    {
      to: '/profile',
      icon: User,
      label: t('nav.profile') || 'Profile',
      match: (path: string) => path === '/profile',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t md:hidden">
      <div className="flex items-center justify-around px-2 py-3 max-w-screen-sm mx-auto">
        {navItems.map((item) => {
          const isActive = item.match(location.pathname);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
