import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LevelCard } from '@/components/LevelCard';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LoginArea } from '@/components/auth/LoginArea';
import { MobileNav } from '@/components/MobileNav';
import { OverlayScrollbar } from '@/components/OverlayScrollbar';
import { useCatalogStore } from '@/stores/catalog';
import { useRTL } from '@/hooks/useRTL';

export function Catalog() {
  useRTL();
  const { t } = useTranslation();
  const { levels } = useCatalogStore();

  return (
    <OverlayScrollbar className="h-screen">
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/logo-h.png" 
                alt="Zaptalk Logo" 
                className="h-12 w-12 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                {t('app.name')}
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <LoginArea className="max-w-60" />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Level
          </h1>
          <p className="text-xl text-muted-foreground">
            Start from A1 (beginner) or jump to your current level
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl">
          {levels.map((level) => (
            <LevelCard key={level.code} level={level} />
          ))}
        </div>

        <div className="mt-16 p-8 bg-muted/50 rounded-2xl max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Not Sure Where to Start?</h2>
          <p className="text-center text-muted-foreground mb-6">
            Begin with A1 and work your way up. All A1 lessons have free previews!
          </p>
          <div className="text-center">
            <Link to="/catalog/A1">
              <Button size="lg" className="gap-2">
                Start with A1
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
      </div>
    </OverlayScrollbar>
  );
}
