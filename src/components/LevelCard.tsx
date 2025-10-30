import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DirectionalArrow } from '@/components/DirectionalArrow';
import type { Level } from '@/types/catalog';
import { cn } from '@/lib/utils';

interface LevelCardProps {
  level: Level;
  className?: string;
}

const levelColors = {
  A1: 'from-green-500 to-emerald-600',
  A2: 'from-blue-500 to-cyan-600',
  B1: 'from-purple-500 to-violet-600',
  B2: 'from-orange-500 to-red-600',
  C1: 'from-pink-500 to-rose-600',
  C2: 'from-amber-500 to-yellow-600',
};

export function LevelCard({ level, className }: LevelCardProps) {
  const gradientClass = levelColors[level.code] || 'from-gray-500 to-gray-600';

  return (
    <Card
      className={cn(
        'hover:shadow-2xl transition-all duration-300 overflow-hidden group',
        className
      )}
    >
      <div className={cn('h-32 bg-gradient-to-br', gradientClass, 'relative')}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-5xl font-bold mb-2">{level.code}</div>
            <div className="text-sm font-medium opacity-90">{level.title}</div>
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <p className="text-muted-foreground text-sm">{level.description}</p>
      </CardHeader>

      <CardContent>
        <Link to={`/catalog/${level.code}`}>
          <Button className="w-full gap-2 group-hover:gap-3 transition-all" variant="outline">
            <BookOpen className="h-4 w-4" />
            Explore Level
            <DirectionalArrow direction="forward" className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
