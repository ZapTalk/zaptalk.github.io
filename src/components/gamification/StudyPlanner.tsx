import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  CheckCircle2,
  Circle,
  Flame,
  Award,
  BarChart3,
  Plus,
  Edit,
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamificationStore } from '@/stores/gamification';
import { useState, useMemo } from 'react';

interface StudyPlannerProps {
  className?: string;
}

interface WeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  lessonsCompleted: number;
  minutesStudied: number;
  goalMet: boolean;
}

export function StudyPlanner({ className }: StudyPlannerProps) {
  const { t } = useTranslation();
  const { dailyGoals, sessions, streak, setDailyGoal } = useGamificationStore();
  
  const [editMode, setEditMode] = useState(false);
  const [targetLessons, setTargetLessons] = useState(
    dailyGoals[getTodayKey()]?.lessonsTarget || 2
  );
  const [targetMinutes, setTargetMinutes] = useState(
    dailyGoals[getTodayKey()]?.minutesTarget || 15
  );

  // Get current week data
  const currentWeek = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    
    const weekDays: WeekDay[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const dateKey = getDateKey(date);
      const todaySessions = sessions.filter(s => {
        const sessionDate = new Date(s.startTime);
        return getDateKey(sessionDate) === dateKey && s.completed;
      });
      
      const lessonsCompleted = todaySessions.length;
      const minutesStudied = Math.round(
        todaySessions.reduce((sum, s) => sum + (s.endTime! - s.startTime) / 60000, 0)
      );
      
      const dailyGoal = dailyGoals[dateKey];
      const goalMet = dailyGoal 
        ? lessonsCompleted >= dailyGoal.lessonsTarget && minutesStudied >= dailyGoal.minutesTarget
        : false;
      
      const isToday = dateKey === getTodayKey();
      const isPast = date < today && !isToday;
      const isFuture = date > today && !isToday;
      
      weekDays.push({
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday,
        isPast,
        isFuture,
        lessonsCompleted,
        minutesStudied,
        goalMet,
      });
    }
    
    return weekDays;
  }, [sessions, dailyGoals]);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const totalLessons = currentWeek.reduce((sum, day) => sum + day.lessonsCompleted, 0);
    const totalMinutes = currentWeek.reduce((sum, day) => sum + day.minutesStudied, 0);
    const daysStudied = currentWeek.filter(day => day.lessonsCompleted > 0).length;
    const goalsMetCount = currentWeek.filter(day => day.goalMet).length;
    const consistency = Math.round((daysStudied / 7) * 100);
    
    return {
      totalLessons,
      totalMinutes,
      daysStudied,
      goalsMetCount,
      consistency,
      averageLessonsPerDay: Math.round(totalLessons / 7 * 10) / 10,
      averageMinutesPerDay: Math.round(totalMinutes / 7),
    };
  }, [currentWeek]);

  // Get monthly stats
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const monthSessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= firstDayOfMonth && sessionDate <= lastDayOfMonth && s.completed;
    });
    
    const totalLessons = monthSessions.length;
    const totalMinutes = Math.round(
      monthSessions.reduce((sum, s) => sum + (s.endTime! - s.startTime) / 60000, 0)
    );
    
    // Count unique days studied
    const uniqueDays = new Set(
      monthSessions.map(s => getDateKey(new Date(s.startTime)))
    ).size;
    
    return {
      totalLessons,
      totalMinutes,
      daysStudied: uniqueDays,
      daysInMonth: lastDayOfMonth.getDate(),
    };
  }, [sessions]);

  const handleSaveGoal = () => {
    setDailyGoal(targetLessons, targetMinutes);
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setTargetLessons(dailyGoals[getTodayKey()]?.lessonsTarget || 2);
    setTargetMinutes(dailyGoals[getTodayKey()]?.minutesTarget || 15);
    setEditMode(false);
  };

  const todayGoal = dailyGoals[getTodayKey()];
  const todayData = currentWeek.find(d => d.isToday);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-500" />
                {t('gamification.planner.title')}
              </h2>
              <p className="text-muted-foreground">{t('gamification.planner.weekly_plan')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-xl font-bold">{streak.currentStreak}</span>
              <span className="text-sm text-muted-foreground">{t('gamification.streak.days', { count: streak.currentStreak })}</span>
            </div>
          </div>

          {/* Weekly Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-green-500" />
                <p className="text-xs text-muted-foreground">{t('gamification.lessons')}</p>
              </div>
              <p className="text-2xl font-bold">{weeklyStats.totalLessons}</p>
              <p className="text-xs text-muted-foreground">
                {t('gamification.planner.this_week')}
              </p>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <p className="text-xs text-muted-foreground">{t('common.minutes')}</p>
              </div>
              <p className="text-2xl font-bold">{weeklyStats.totalMinutes}</p>
              <p className="text-xs text-muted-foreground">
                {weeklyStats.averageMinutesPerDay} {t('common.minutes')}/day
              </p>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <p className="text-xs text-muted-foreground">{t('gamification.planner.consistency')}</p>
              </div>
              <p className="text-2xl font-bold">{weeklyStats.consistency}%</p>
              <p className="text-xs text-muted-foreground">
                {weeklyStats.daysStudied}/7 {t('gamification.streak.days', { count: weeklyStats.daysStudied })}
              </p>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-orange-500" />
                <p className="text-xs text-muted-foreground">{t('gamification.goals.daily_goal')}</p>
              </div>
              <p className="text-2xl font-bold">{weeklyStats.goalsMetCount}</p>
              <p className="text-xs text-muted-foreground">
                {t('gamification.planner.goals_achieved')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Daily Goal Setting */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">{t('gamification.goals.daily_goal')}</h3>
            </div>
            {!editMode ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(true)}
              >
                <Edit className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t('common.edit')}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  {t('common.cancel')}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveGoal}
                >
                  <Check className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  {t('common.save')}
                </Button>
              </div>
            )}
          </div>

          {editMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lessons-target">{t('gamification.goals.lessons_target')}</Label>
                <Input
                  id="lessons-target"
                  type="number"
                  min={1}
                  max={20}
                  value={targetLessons}
                  onChange={(e) => setTargetLessons(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minutes-target">{t('gamification.goals.minutes_target')}</Label>
                <Input
                  id="minutes-target"
                  type="number"
                  min={5}
                  max={180}
                  step={5}
                  value={targetMinutes}
                  onChange={(e) => setTargetMinutes(parseInt(e.target.value) || 5)}
                />
              </div>
            </div>
          ) : (
            <div>
              {todayGoal ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('gamification.lessons')}</span>
                    <span className="font-medium">
                      {todayData?.lessonsCompleted || 0} / {todayGoal.lessonsTarget}
                    </span>
                  </div>
                  <Progress 
                    value={((todayData?.lessonsCompleted || 0) / todayGoal.lessonsTarget) * 100} 
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('common.minutes')}</span>
                    <span className="font-medium">
                      {todayData?.minutesStudied || 0} / {todayGoal.minutesTarget}
                    </span>
                  </div>
                  <Progress 
                    value={((todayData?.minutesStudied || 0) / todayGoal.minutesTarget) * 100} 
                    className="h-2"
                  />

                  {todayData?.goalMet ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">{t('gamification.goals.completed')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-medium">{t('gamification.goals.keep_going')}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">{t('gamification.goals.set_goal')}</p>
                  <Button onClick={() => setEditMode(true)}>
                    <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t('gamification.goals.set_goal')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Weekly Calendar */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t('gamification.planner.this_week')}
          </h3>

          <div className="grid grid-cols-7 gap-2">
            {currentWeek.map((day, index) => (
              <div
                key={index}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all',
                  day.isToday && 'border-primary bg-primary/5',
                  !day.isToday && 'border-muted',
                  day.goalMet && 'bg-green-50 dark:bg-green-950/20',
                  day.isPast && !day.goalMet && day.lessonsCompleted === 0 && 'opacity-60'
                )}
              >
                <div className="text-center space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">
                    {day.dayName}
                  </div>
                  <div className={cn(
                    'text-lg font-bold',
                    day.isToday && 'text-primary'
                  )}>
                    {day.dayNumber}
                  </div>
                  
                  {day.goalMet ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                  ) : day.lessonsCompleted > 0 ? (
                    <Circle className="h-5 w-5 text-blue-500 mx-auto" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                  )}

                  {day.lessonsCompleted > 0 && (
                    <div className="text-xs space-y-1">
                      <div className="font-medium text-green-600 dark:text-green-400">
                        {day.lessonsCompleted} {t('gamification.lessons')}
                      </div>
                      <div className="text-muted-foreground">
                        {day.minutesStudied}m
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Monthly Overview */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold">{t('common.monthly_stats')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('gamification.stats.lessons_completed')}</span>
                <span className="text-xl font-bold">{monthlyStats.totalLessons}</span>
              </div>
              <Progress 
                value={(monthlyStats.totalLessons / 100) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('gamification.stats.total_study_time')}</span>
                <span className="text-xl font-bold">{Math.round(monthlyStats.totalMinutes / 60)}h</span>
              </div>
              <Progress 
                value={(monthlyStats.totalMinutes / 1000) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('gamification.planner.consistency')}</span>
                <span className="text-xl font-bold">
                  {Math.round((monthlyStats.daysStudied / monthlyStats.daysInMonth) * 100)}%
                </span>
              </div>
              <Progress 
                value={(monthlyStats.daysStudied / monthlyStats.daysInMonth) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Helper functions
function getTodayKey(): string {
  return getDateKey(new Date());
}

function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}
