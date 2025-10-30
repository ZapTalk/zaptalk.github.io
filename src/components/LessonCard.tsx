import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { LockBadge } from '@/components/LockBadge';
import { useEntitlementsStore } from '@/stores/entitlements';
import type { Lesson } from '@/types/catalog';
import { cn } from '@/lib/utils';

interface LessonCardProps {
  lesson: Lesson;
  className?: string;
}

export function LessonCard({ lesson, className }: LessonCardProps) {
  const { hasAccess, getProgress } = useEntitlementsStore();
  const isUnlocked = hasAccess(lesson.id);
  const progress = getProgress(lesson.id);

  return (
    <Link to={`/lesson/${lesson.id}`}>
      <Card
        className={cn(
          'hover:shadow-lg transition-all duration-300 cursor-pointer group',
          !isUnlocked && 'opacity-75',
          className
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {lesson.title}
              </h3>
              {lesson.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {lesson.description}
                </p>
              )}
            </div>
            <LockBadge
              isFree={lesson.isFree}
              isUnlocked={isUnlocked}
              priceSats={lesson.priceSats}
            />
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{lesson.durationMin} min</span>
            </div>
            <div className="capitalize px-2 py-1 bg-primary/10 rounded text-xs font-medium">
              {lesson.kind}
            </div>
          </div>
        </CardContent>

        {progress && (
          <CardFooter className="pt-3 border-t">
            <div className="flex items-center gap-2 text-sm">
              {progress.completed ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">Completed</span>
                  {progress.score !== undefined && (
                    <span className="text-muted-foreground">• {progress.score}%</span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-primary font-medium">In Progress</span>
                </>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
