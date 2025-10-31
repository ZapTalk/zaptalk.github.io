import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Zap, TrendingUp } from 'lucide-react';
import { useGamificationStore } from '@/stores/gamification';
import { getTotalXPForLevel, getLevelTitle } from '@/types/gamification';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface XPBarProps {
  className?: string;
  showDetails?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

export function XPBar({ className, showDetails = true, variant = 'default' }: XPBarProps) {
  const { t } = useTranslation();
  
  // Select specific primitive values from the store to avoid returning
  // a fresh object on each render (which can cause render loops).
  // Select primitive values separately to avoid returning new objects from the selector
  const totalXP = useGamificationStore((s) => s.xp);
  const currentLevel = useGamificationStore((s) => s.level);
  const totalLessonsCompleted = useGamificationStore((s) => s.sessions.filter((ss) => ss.completed).length);
  const currentStreak = useGamificationStore((s) => s.streak.currentStreak);
  const achievementsUnlocked = useGamificationStore((s) => s.achievements.length);

  // Minimal validation
  if (totalXP === undefined || currentLevel === undefined) return null;

  // Compute level metadata locally (stable, pure functions)
  const levelTitle = getLevelTitle(currentLevel);
  const totalXPForCurrentLevel = getTotalXPForLevel(currentLevel);
  const totalXPForNextLevel = getTotalXPForLevel(currentLevel + 1);
  const xpToNext = Math.max(0, totalXPForNextLevel - totalXP);
  const xpProgress = totalXPForNextLevel > totalXPForCurrentLevel
    ? ((totalXP - totalXPForCurrentLevel) / (totalXPForNextLevel - totalXPForCurrentLevel)) * 100
    : 0;

  // Get translated level title
  const levelTitleKey = levelTitle.toLowerCase().replace(' ', '_');
  const translatedLevelTitle = t(`gamification.level_titles.${levelTitleKey}`, { defaultValue: levelTitle });

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        <span className="text-sm font-medium">{totalXP.toLocaleString()} {t('gamification.xp')}</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-1', className)}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold">{t('gamification.level')} {currentLevel}</span>
            <span className="text-muted-foreground">{translatedLevelTitle}</span>
          </div>
          <span className="text-muted-foreground text-xs">
            {totalXP.toLocaleString()} / {(totalXP + xpToNext).toLocaleString()} {t('gamification.xp')}
          </span>
        </div>
        <Progress value={xpProgress} className="h-2" />
      </div>
    );
  }

  return (
    <Card className={cn('p-4', className)}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{t('gamification.level')} {currentLevel}</h3>
                <span className="text-sm text-muted-foreground">• {translatedLevelTitle}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('gamification.xp_to_next_level', { xp: xpToNext.toLocaleString() })}
              </p>
            </div>
          </div>
          <div className="text-end">
            <div className="flex items-center gap-1 justify-end">
              <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-lg font-bold">{totalXP.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t('gamification.total_xp')}</p>
          </div>
        </div>

        <div className="space-y-1">
          <Progress value={xpProgress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(xpProgress)}%</span>
            <span>{(totalXP + xpToNext).toLocaleString()} {t('gamification.xp')}</span>
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="text-center">
              <p className="text-lg font-bold">{totalLessonsCompleted}</p>
              <p className="text-xs text-muted-foreground">{t('gamification.lessons')}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{currentStreak}</p>
              <p className="text-xs text-muted-foreground">{t('gamification.day_streak')}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{achievementsUnlocked}</p>
              <p className="text-xs text-muted-foreground">{t('gamification.achievements_count')}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
