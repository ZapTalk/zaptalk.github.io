import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Zap, TrendingUp } from 'lucide-react';
import { useGamificationStore } from '@/stores/gamification';
import { cn } from '@/lib/utils';

interface XPBarProps {
  className?: string;
  showDetails?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

export function XPBar({ className, showDetails = true, variant = 'default' }: XPBarProps) {
  const stats = useGamificationStore((state) => state.getStats());

  if (
    !stats ||
    stats.totalXP === undefined ||
    stats.xpToNextLevel === undefined ||
    stats.xpProgress === undefined ||
    stats.currentLevel === undefined
  ) {
    return null;
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        <span className="text-sm font-medium">{stats.totalXP.toLocaleString()} XP</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-1', className)}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold">Level {stats.currentLevel}</span>
            <span className="text-muted-foreground">{stats.levelTitle}</span>
          </div>
          <span className="text-muted-foreground text-xs">
            {stats.totalXP.toLocaleString()} / {(stats.totalXP + stats.xpToNextLevel).toLocaleString()} XP
          </span>
        </div>
        <Progress value={stats.xpProgress} className="h-2" />
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
                <h3 className="text-xl font-bold">Level {stats.currentLevel}</h3>
                <span className="text-sm text-muted-foreground">• {stats.levelTitle}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.xpToNextLevel.toLocaleString()} XP to next level
              </p>
            </div>
          </div>
          <div className="text-end">
            <div className="flex items-center gap-1 justify-end">
              <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-lg font-bold">{stats.totalXP.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
        </div>

        <div className="space-y-1">
          <Progress value={stats.xpProgress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.round(stats.xpProgress)}%</span>
            <span>{(stats.totalXP + stats.xpToNextLevel).toLocaleString()} XP</span>
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div className="text-center">
              <p className="text-lg font-bold">{stats.totalLessonsCompleted}</p>
              <p className="text-xs text-muted-foreground">Lessons</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{stats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{stats.achievementsUnlocked}</p>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
