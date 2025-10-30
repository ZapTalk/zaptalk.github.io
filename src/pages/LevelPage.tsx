import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonCard } from '@/components/LessonCard';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LoginArea } from '@/components/auth/LoginArea';
import { MobileNav } from '@/components/MobileNav';
import { OverlayScrollbar } from '@/components/OverlayScrollbar';
import { useCatalogStore } from '@/stores/catalog';
import { useRTL } from '@/hooks/useRTL';
import type { LevelCode } from '@/types/catalog';

export function LevelPage() {
  useRTL();
  const { t } = useTranslation();
  const { levelCode } = useParams<{ levelCode: LevelCode }>();
  const { getLevelByCode, getModulesByLevel, getLessonsByModule } = useCatalogStore();

  const level = levelCode ? getLevelByCode(levelCode as LevelCode) : undefined;
  const modules = levelCode ? getModulesByLevel(levelCode as LevelCode) : [];

  if (!level) {
    return <Navigate to="/catalog" replace />;
  }

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
          <Link to="/catalog">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Button>
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl font-bold text-primary">{level.code}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{level.title}</h1>
              <p className="text-lg text-muted-foreground">{level.description}</p>
            </div>
          </div>
        </div>

        {modules.map((module) => {
          const lessons = getLessonsByModule(module.id);

          return (
            <div key={module.id} className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
                {module.description && (
                  <p className="text-muted-foreground">{module.description}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            </div>
          );
        })}

        {modules.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              Lessons for this level are coming soon!
            </p>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
      </div>
    </OverlayScrollbar>
  );
}
