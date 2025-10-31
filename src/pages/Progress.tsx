import { useTranslation } from 'react-i18next';
import { XPBar } from '@/components/gamification/XPBar';
import { LearningRoadmap } from '@/components/gamification/LearningRoadmap';
import { StudyPlanner } from '@/components/gamification/StudyPlanner';
import { useEffect } from 'react';

export function Progress() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('gamification.roadmap.title')} - ZapTalk`;
  }, [t]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          {/* Header with XP Bar */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{t('gamification.stats.title')}</h1>
            <p className="text-muted-foreground">
              {t('gamification.roadmap.your_journey')}
            </p>
          </div>

          {/* XP Progress Card */}
          <XPBar variant="default" showDetails={true} />

          {/* Study Planner */}
          <StudyPlanner />

          {/* Learning Roadmap */}
          <LearningRoadmap />
        </div>
      </div>
  );
}
