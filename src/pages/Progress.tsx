import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { XPBar } from '@/components/gamification/XPBar';
import { LearningRoadmap } from '@/components/gamification/LearningRoadmap';
import { StudyPlanner } from '@/components/gamification/StudyPlanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGamificationStore } from '@/stores/gamification';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Calendar, TrendingUp, Award, Flame, Clock, BookOpen, ArrowLeft } from 'lucide-react';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { useRTL } from '@/hooks/useRTL';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function Progress() {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const navigate = useNavigate();
  
  const achievements = useGamificationStore((s) => s.achievements);
  const streak = useGamificationStore((s) => s.streak);
  const sessions = useGamificationStore((s) => s.sessions);
  const dailyGoals = useGamificationStore((s) => s.dailyGoals);

  // Calculate stats
  const completedSessions = sessions.filter(s => s.completed);
  const totalStudyMinutes = completedSessions.reduce((sum, s) => sum + s.duration, 0);

  // Today's goal progress
  const today = new Date().toISOString().split('T')[0];
  const todayGoal = dailyGoals[today];
  const goalProgress = todayGoal
    ? Math.min((todayGoal.lessonsCompleted / todayGoal.lessonsTarget) * 100, 100)
    : 0;

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Back Button and Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4 gap-2"
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
          {t('common.back')}
        </Button>
        <h1 className="text-4xl font-bold mb-2">{t('progress.title')}</h1>
        <p className="text-muted-foreground">{t('progress.subtitle')}</p>
      </div>

      {/* XP Bar - Full Width */}
      <div className="mb-6">
        <XPBar variant="default" showDetails={true} />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Study Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('gamification.stats.total_study_time')}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m
            </div>
          </CardContent>
        </Card>

        {/* Lessons Completed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('gamification.stats.lessons_completed')}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedSessions.length}</div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('gamification.streak.current')}
            </CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {streak.currentStreak} {t('gamification.streak.days', { count: streak.currentStreak })}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('gamification.achievements_count')}
            </CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Goal */}
      {todayGoal && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  {t('gamification.goals.daily_goal')}
                </CardTitle>
                <CardDescription>
                  {todayGoal.lessonsCompleted} / {todayGoal.lessonsTarget} {t('gamification.lessons').toLowerCase()}
                </CardDescription>
              </div>
              <Badge variant={goalProgress === 100 ? "default" : "secondary"}>
                {Math.round(goalProgress)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ProgressBar value={goalProgress} className="h-3" />
            {goalProgress === 100 && (
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                {t('gamification.goals.completed')}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content - Tabs */}
      <Tabs defaultValue="roadmap" className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roadmap" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('gamification.roadmap.title')}
          </TabsTrigger>
          <TabsTrigger value="planner" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('gamification.planner.title')}
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            {t('gamification.achievements.unlocked')}
          </TabsTrigger>
        </TabsList>

        {/* Roadmap Tab */}
        <TabsContent value="roadmap" className="space-y-4">
          <LearningRoadmap />
        </TabsContent>

        {/* Planner Tab */}
        <TabsContent value="planner" className="space-y-4">
          <StudyPlanner />
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('gamification.achievements.unlocked')}</CardTitle>
              <CardDescription>
                {achievements.length} / 40 {t('gamification.achievements.unlocked').toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>{t('progress.no_achievements')}</p>
                  <p className="text-sm mt-2">{t('progress.complete_lessons_to_earn')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className="border-2">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div>
                              <CardTitle className="text-base">
                                {t(`achievements.${achievement.id}.title`)}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {t(`achievements.${achievement.id}.description`)}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            +{achievement.xpReward} XP
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
