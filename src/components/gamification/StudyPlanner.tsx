import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Circle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamificationStore } from '@/stores/gamification';
import type { DailyGoal } from '@/types/gamification';

interface StudyPlannerProps {
  className?: string;
}

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export function StudyPlanner({ className }: StudyPlannerProps) {
  const { t } = useTranslation();
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [lessonsTarget, setLessonsTarget] = useState(2);
  const [minutesTarget, setMinutesTarget] = useState(15);
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0); // 0 = current week, 1 = next week, -1 = last week

  const dailyGoals = useGamificationStore((s) => s.dailyGoals);
  const setDailyGoal = useGamificationStore((s) => s.setDailyGoal);

  // Get week boundaries
  const weekBoundaries = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - currentDay + (selectedWeekOffset * 7));
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { weekStart, weekEnd };
  }, [selectedWeekOffset]);

  // Get goals for current week
  const weekGoals = useMemo(() => {
    const goals: Record<string, DailyGoal | null> = {
      sunday: null,
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
    };

    const { weekStart } = weekBoundaries;

    DAYS_OF_WEEK.forEach((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const dateString = date.toISOString().split('T')[0];

      const goal = dailyGoals[dateString];
      if (goal) {
        goals[day] = goal;
      }
    });

    return goals;
  }, [dailyGoals, weekBoundaries]);

  // Calculate week statistics
  const weekStats = useMemo(() => {
    const goalsArray = Object.values(weekGoals).filter((g): g is DailyGoal => g !== null);
    const totalGoals = goalsArray.length;
    const achievedGoals = goalsArray.filter((g) => g.achieved).length;
    const percentage = totalGoals > 0 ? Math.round((achievedGoals / totalGoals) * 100) : 0;

    return { totalGoals, achievedGoals, percentage };
  }, [weekGoals]);

  const handleSetGoal = () => {
    setDailyGoal(lessonsTarget, minutesTarget);
    setShowGoalSetting(false);
  };

  const formatWeekRange = () => {
    const { weekStart, weekEnd } = weekBoundaries;
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${weekStart.toLocaleDateString(undefined, options)} - ${weekEnd.toLocaleDateString(undefined, options)}`;
  };

  const isCurrentWeek = selectedWeekOffset === 0;
  const isFutureWeek = selectedWeekOffset > 0;

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{t('gamification.planner.title')}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {formatWeekRange()}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGoalSetting(!showGoalSetting)}
          >
            <Target className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('gamification.planner.set_schedule')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedWeekOffset(selectedWeekOffset - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Badge variant={isCurrentWeek ? 'default' : 'secondary'}>
            {isCurrentWeek && t('gamification.planner.this_week')}
            {selectedWeekOffset > 0 && t('gamification.planner.next_week')}
            {selectedWeekOffset < 0 && `Week ${Math.abs(selectedWeekOffset)} ago`}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedWeekOffset(selectedWeekOffset + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Goal Setting Form */}
        {showGoalSetting && (
          <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
            <div className="space-y-2">
              <Label htmlFor="lessons-target">{t('gamification.goals.lessons_target')}</Label>
              <Input
                id="lessons-target"
                type="number"
                min="1"
                max="10"
                value={lessonsTarget}
                onChange={(e) => setLessonsTarget(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minutes-target">{t('gamification.goals.minutes_target')}</Label>
              <Input
                id="minutes-target"
                type="number"
                min="5"
                max="120"
                step="5"
                value={minutesTarget}
                onChange={(e) => setMinutesTarget(parseInt(e.target.value) || 5)}
              />
            </div>
            <Button onClick={handleSetGoal} className="w-full">
              {t('gamification.goals.set_goal')}
            </Button>
          </div>
        )}

        {/* Week Progress */}
        {!isFutureWeek && weekStats.totalGoals > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('gamification.planner.consistency')}
              </span>
              <span className="font-bold">{weekStats.percentage}%</span>
            </div>
            <Progress value={weekStats.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {weekStats.achievedGoals} / {weekStats.totalGoals} {t('gamification.planner.goals_achieved')}
            </p>
          </div>
        )}

        {/* Daily Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day, index) => {
            const goal = weekGoals[day];
            const date = new Date(weekBoundaries.weekStart);
            date.setDate(weekBoundaries.weekStart.getDate() + index);
            const dayNum = date.getDate();
            const isToday = isCurrentWeek && new Date().getDay() === index;

            return (
              <div
                key={day}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all',
                  isToday && 'border-primary bg-primary/5',
                  !isToday && 'border-muted',
                  goal?.achieved && 'border-green-500 bg-green-50 dark:bg-green-950'
                )}
              >
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase">
                      {day.slice(0, 3)}
                    </span>
                    <span className="text-xs text-muted-foreground">{dayNum}</span>
                  </div>

                  {goal ? (
                    <>
                      <div className="flex justify-center">
                        {goal.achieved ? (
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        ) : (
                          <Circle className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs">
                          {goal.lessonsCompleted}/{goal.lessonsTarget} lessons
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {goal.minutesCompleted}/{goal.minutesTarget} min
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="py-4 text-muted-foreground">
                      <Circle className="h-8 w-8 mx-auto opacity-30" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {weekStats.totalGoals === 0 && !showGoalSetting && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium mb-1">{t('gamification.goals.set_goal')}</p>
            <p className="text-sm">{t('gamification.planner.set_schedule')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
