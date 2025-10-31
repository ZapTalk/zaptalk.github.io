import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Lock, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGamificationStore } from '@/stores/gamification';
import { useEntitlementsStore } from '@/stores/entitlements';
import { levels } from '@/data/levels';
import { lessons } from '@/data/lessons';
import type { RoadmapNode } from '@/types/gamification';

interface LearningRoadmapProps {
  className?: string;
}

export function LearningRoadmap({ className }: LearningRoadmapProps) {
  const { t } = useTranslation();
  
  // Select only the data we need, not functions
  const completedLessonIds = useGamificationStore((s) => 
    s.sessions.filter((ss) => ss.completed).map((ss) => ss.lessonId)
  );
  const entitlements = useEntitlementsStore((s) => s.entitlements);
  
  // Build roadmap nodes from lessons
  const roadmapNodes = useMemo((): RoadmapNode[] => {
    const nodes: RoadmapNode[] = [];
    
    lessons.forEach((lesson) => {
      const isCompleted = completedLessonIds.includes(lesson.id);
      // Check access locally instead of using the function
      const isUnlocked = lesson.isFree || entitlements.some((e) => e.skuId === lesson.id);
      const isInProgress = false; // TODO: Track from active sessions
      
      let status: RoadmapNode['status'] = 'locked';
      if (isCompleted) {
        status = 'completed';
      } else if (isInProgress) {
        status = 'in-progress';
      } else if (isUnlocked) {
        status = 'available';
      }

      // Simple positioning: vertical list grouped by level
      const levelIndex = levels.findIndex((l) => l.code === lesson.level);
      const lessonsInLevel = lessons.filter((l) => l.level === lesson.level);
      const lessonIndexInLevel = lessonsInLevel.findIndex((l) => l.id === lesson.id);

      nodes.push({
        lessonId: lesson.id,
        level: lesson.level,
        moduleId: lesson.moduleId,
        position: { 
          x: lessonIndexInLevel * 200, 
          y: levelIndex * 150 
        },
        status,
        dependencies: [], // Could be calculated based on lesson order
        xpReward: 100, // Base XP per lesson
      });
    });

    return nodes;
  }, [completedLessonIds, entitlements]);

  // Group nodes by level
  const nodesByLevel = useMemo(() => {
    const grouped = new Map<string, RoadmapNode[]>();
    
    roadmapNodes.forEach((node) => {
      if (!grouped.has(node.level)) {
        grouped.set(node.level, []);
      }
      grouped.get(node.level)!.push(node);
    });

    return grouped;
  }, [roadmapNodes]);

  // Calculate progress per level
  const levelProgress = useMemo(() => {
    const progress = new Map<string, { completed: number; total: number; percentage: number }>();

    nodesByLevel.forEach((nodes, levelCode) => {
      const completed = nodes.filter((n) => n.status === 'completed').length;
      const total = nodes.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      progress.set(levelCode, { completed, total, percentage });
    });

    return progress;
  }, [nodesByLevel]);

  const getStatusIcon = (status: RoadmapNode['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <PlayCircle className="h-5 w-5 text-blue-500" />;
      case 'available':
        return <Circle className="h-5 w-5 text-muted-foreground" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: RoadmapNode['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'available':
        return 'bg-primary';
      case 'locked':
        return 'bg-muted';
    }
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{t('gamification.roadmap.title')}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('gamification.roadmap.your_journey')}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {levels.map((level) => {
          const nodes = nodesByLevel.get(level.code) || [];
          const progress = levelProgress.get(level.code) || { completed: 0, total: 0, percentage: 0 };

          if (nodes.length === 0) return null;

          return (
            <div key={level.code} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{t(level.title)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {progress.completed} / {progress.total} {t('gamification.lessons')}
                  </p>
                </div>
                <Badge variant={progress.percentage === 100 ? 'default' : 'secondary'}>
                  {progress.percentage}%
                </Badge>
              </div>

              <Progress value={progress.percentage} className="h-2" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {nodes.map((node) => {
                  const lesson = lessons.find((l) => l.id === node.lessonId);
                  if (!lesson) return null;

                  return (
                    <div
                      key={node.lessonId}
                      className={cn(
                        'relative p-3 rounded-lg border-2 transition-all',
                        node.status === 'completed' && 'border-green-500 bg-green-50 dark:bg-green-950',
                        node.status === 'in-progress' && 'border-blue-500 bg-blue-50 dark:bg-blue-950',
                        node.status === 'available' && 'border-primary bg-primary/5',
                        node.status === 'locked' && 'border-muted bg-muted/50 opacity-60'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {getStatusIcon(node.status)}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {lesson.durationMin} min • {node.xpReward} XP
                          </p>
                        </div>
                      </div>

                      {node.status === 'completed' && (
                        <div className="absolute top-2 right-2">
                          <div className={cn('h-2 w-2 rounded-full', getStatusColor(node.status))} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {roadmapNodes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t('catalog.no_lessons_found')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
