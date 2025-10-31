import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  Clock, 
  Trophy,
  TrendingUp,
  Target,
  Award,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { levels } from '@/data/levels';
import { lessons } from '@/data/lessons';
import { modules } from '@/data/modules';
import { useEntitlementsStore } from '@/stores/entitlements';
import { useGamificationStore } from '@/stores/gamification';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface RoadmapNode {
  id: string;
  type: 'level' | 'module' | 'lesson';
  title: string;
  description?: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress: number; // 0-100
  children?: RoadmapNode[];
  lessonCount?: number;
  completedCount?: number;
  estimatedMinutes?: number;
  cefrLevel?: string;
}

interface LearningRoadmapProps {
  className?: string;
  compact?: boolean;
}

export function LearningRoadmap({ className, compact = false }: LearningRoadmapProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { hasAccess } = useEntitlementsStore();
  const { sessions } = useGamificationStore();
  
  // Calculate completed lessons
  const completedLessonIds = useMemo(() => {
    return new Set(
      sessions
        .filter(s => s.completed)
        .map(s => s.lessonId)
    );
  }, [sessions]);

  // Build roadmap structure
  const roadmapData = useMemo((): RoadmapNode[] => {
    return levels.map(level => {
      const levelModules = modules.filter(m => m.level === level.code);
      const levelLessons = lessons.filter(l => l.level === level.code);
      
      const completedInLevel = levelLessons.filter(l => completedLessonIds.has(l.id)).length;
      const totalInLevel = levelLessons.length;
      
      // Determine level status
      let levelStatus: RoadmapNode['status'] = 'locked';
      if (level.code === 'A1') {
        levelStatus = completedInLevel === totalInLevel ? 'completed' : 
                      completedInLevel > 0 ? 'in-progress' : 'available';
      } else {
        // Check if previous level is completed
        const prevLevelIndex = levels.findIndex(l => l.code === level.code) - 1;
        if (prevLevelIndex >= 0) {
          const prevLevel = levels[prevLevelIndex];
          const prevLessons = lessons.filter(l => l.level === prevLevel.code);
          const prevCompleted = prevLessons.filter(l => completedLessonIds.has(l.id)).length;
          
          if (prevCompleted === prevLessons.length) {
            levelStatus = completedInLevel === totalInLevel ? 'completed' : 
                         completedInLevel > 0 ? 'in-progress' : 'available';
          }
        }
      }

      const moduleNodes: RoadmapNode[] = levelModules.map(module => {
        const moduleLessons = lessons.filter(l => l.moduleId === module.id);
        const completedInModule = moduleLessons.filter(l => completedLessonIds.has(l.id)).length;
        const totalInModule = moduleLessons.length;
        
        let moduleStatus: RoadmapNode['status'] = 'locked';
        if (levelStatus !== 'locked') {
          moduleStatus = completedInModule === totalInModule ? 'completed' :
                        completedInModule > 0 ? 'in-progress' : 'available';
        }

        const lessonNodes: RoadmapNode[] = moduleLessons.map(lesson => {
          const isCompleted = completedLessonIds.has(lesson.id);
          const isUnlocked = lesson.isFree || hasAccess(lesson.id);
          
          let lessonStatus: RoadmapNode['status'] = 'locked';
          if (moduleStatus !== 'locked') {
            lessonStatus = isCompleted ? 'completed' :
                          isUnlocked ? 'available' : 'locked';
          }

          return {
            id: lesson.id,
            type: 'lesson' as const,
            title: lesson.title,
            description: lesson.description,
            status: lessonStatus,
            progress: isCompleted ? 100 : 0,
            estimatedMinutes: lesson.durationMin,
          };
        });

        return {
          id: module.id,
          type: 'module' as const,
          title: module.title,
          description: module.description || '',
          status: moduleStatus,
          progress: totalInModule > 0 ? Math.round((completedInModule / totalInModule) * 100) : 0,
          children: lessonNodes,
          lessonCount: totalInModule,
          completedCount: completedInModule,
          estimatedMinutes: moduleLessons.reduce((sum, l) => sum + l.durationMin, 0),
        };
      });

      return {
        id: level.code,
        type: 'level' as const,
        title: level.title,
        description: level.description || '',
        status: levelStatus,
        progress: totalInLevel > 0 ? Math.round((completedInLevel / totalInLevel) * 100) : 0,
        children: moduleNodes,
        lessonCount: totalInLevel,
        completedCount: completedInLevel,
        estimatedMinutes: levelLessons.reduce((sum, l) => sum + l.durationMin, 0),
        cefrLevel: level.code,
      };
    });
  }, [completedLessonIds, hasAccess]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const totalLessons = lessons.length;
    const completedLessons = completedLessonIds.size;
    const totalMinutes = lessons.reduce((sum, l) => sum + l.durationMin, 0);
    const completedMinutes = lessons
      .filter(l => completedLessonIds.has(l.id))
      .reduce((sum, l) => sum + l.durationMin, 0);
    const remainingMinutes = totalMinutes - completedMinutes;
    
    return {
      totalLessons,
      completedLessons,
      progress: Math.round((completedLessons / totalLessons) * 100),
      totalMinutes,
      completedMinutes,
      remainingMinutes,
      estimatedHours: Math.round(remainingMinutes / 60),
    };
  }, [completedLessonIds]);

  const getStatusIcon = (status: RoadmapNode['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <PlayCircle className="h-5 w-5 text-blue-500" />;
      case 'available':
        return <Circle className="h-5 w-5 text-muted-foreground" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-muted-foreground/50" />;
    }
  };

  const getStatusColor = (status: RoadmapNode['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'available':
        return 'bg-gray-400';
      case 'locked':
        return 'bg-gray-300';
    }
  };

  const handleLessonClick = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);
  };

  if (compact) {
    return (
      <Card className={cn('p-4', className)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-bold">{t('gamification.roadmap.title')}</h3>
            </div>
            <Badge variant="secondary">
              {overallStats.completedLessons} / {overallStats.totalLessons}
            </Badge>
          </div>

          <Progress value={overallStats.progress} className="h-2" />

          <div className="grid grid-cols-6 gap-2">
            {roadmapData.map(level => (
              <div key={level.id} className="space-y-1">
                <div className={cn(
                  'h-2 rounded-full',
                  getStatusColor(level.status),
                  level.status === 'locked' && 'opacity-50'
                )} />
                <p className="text-xs text-center text-muted-foreground">{level.cefrLevel}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{overallStats.estimatedHours}h {t('gamification.roadmap.estimated_time')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span>{overallStats.progress}%</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Stats */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                {t('gamification.roadmap.title')}
              </h2>
              <p className="text-muted-foreground">{t('gamification.roadmap.your_journey')}</p>
            </div>
            <div className="text-end">
              <div className="text-3xl font-bold text-primary">{overallStats.progress}%</div>
              <p className="text-sm text-muted-foreground">{t('gamification.roadmap.progress')}</p>
            </div>
          </div>

          <Progress value={overallStats.progress} className="h-3" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Award className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">{overallStats.completedLessons}</p>
                <p className="text-xs text-muted-foreground">{t('gamification.stats.lessons_completed')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{overallStats.totalLessons - overallStats.completedLessons}</p>
                <p className="text-xs text-muted-foreground">{t('gamification.roadmap.status.available')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">{overallStats.estimatedHours}h</p>
                <p className="text-xs text-muted-foreground">{t('gamification.roadmap.estimated_time')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">{Math.round((overallStats.completedMinutes / overallStats.totalMinutes) * 100)}%</p>
                <p className="text-xs text-muted-foreground">{t('gamification.planner.consistency')}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Roadmap Tree */}
      <div className="space-y-4">
        {roadmapData.map((level, levelIndex) => (
          <Card key={level.id} className={cn(
            'p-6 transition-all',
            level.status === 'locked' && 'opacity-60'
          )}>
            <div className="space-y-4">
              {/* Level Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn(
                    'mt-1 h-10 w-10 rounded-full flex items-center justify-center font-bold',
                    level.status === 'completed' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                    level.status === 'in-progress' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                    level.status === 'available' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
                    level.status === 'locked' && 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                  )}>
                    {level.cefrLevel}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{t(level.title)}</h3>
                      {getStatusIcon(level.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{level.description ? t(level.description) : ''}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{level.completedCount} / {level.lessonCount} {t('gamification.lessons')}</span>
                      <span>•</span>
                      <span>{level.estimatedMinutes} {t('common.minutes')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-end shrink-0">
                  <div className="text-2xl font-bold">{level.progress}%</div>
                  <Progress value={level.progress} className="h-2 w-20 mt-2" />
                </div>
              </div>

              {/* Modules */}
              {level.children && level.children.length > 0 && (
                <div className={cn(
                  'space-y-3 rtl:pr-12 ltr:pl-12',
                  i18n.language === 'fa' || i18n.language === 'ar' ? 'border-r-2' : 'border-l-2',
                  'border-muted'
                )}>
                  {level.children.map((module) => (
                    <div key={module.id} className="space-y-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(module.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{t(module.title)}</h4>
                            <Badge variant="outline" className="text-xs">
                              {module.completedCount}/{module.lessonCount}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{module.description ? t(module.description) : ''}</p>
                        </div>
                        <div className="shrink-0 w-24">
                          <Progress value={module.progress} className="h-1.5" />
                        </div>
                      </div>

                      {/* Lessons */}
                      {module.children && module.children.length > 0 && (
                        <div className={cn(
                          'space-y-1 rtl:pr-8 ltr:pl-8'
                        )}>
                          {module.children.map((lesson) => (
                            <Button
                              key={lesson.id}
                              variant="ghost"
                              className={cn(
                                'w-full justify-start h-auto py-2 px-3',
                                lesson.status === 'locked' && 'opacity-50 cursor-not-allowed'
                              )}
                              onClick={() => lesson.status !== 'locked' && handleLessonClick(lesson.id)}
                              disabled={lesson.status === 'locked'}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <div className={cn(
                                  'h-2 w-2 rounded-full',
                                  getStatusColor(lesson.status)
                                )} />
                                <span className="text-sm flex-1 text-start">{lesson.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  {lesson.estimatedMinutes} {t('common.minutes')}
                                </span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Connection line to next level */}
              {levelIndex < roadmapData.length - 1 && (
                <div className={cn(
                  'flex items-center gap-2 rtl:pr-5 ltr:pl-5 opacity-50'
                )}>
                  <div className="h-8 w-0.5 bg-muted" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
