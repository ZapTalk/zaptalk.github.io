import { create } from 'zustand';
import { levels } from '@/data/levels';
import { modules } from '@/data/modules';
import { lessons } from '@/data/lessons';
import type { Level, Module, Lesson, LevelCode } from '@/types/catalog';

interface CatalogState {
  levels: Level[];
  modules: Module[];
  lessons: Lesson[];
  
  getLevelByCode: (code: LevelCode) => Level | undefined;
  getModuleById: (id: string) => Module | undefined;
  getLessonById: (id: string) => Lesson | undefined;
  getModulesByLevel: (levelCode: LevelCode) => Module[];
  getLessonsByModule: (moduleId: string) => Lesson[];
}

export const useCatalogStore = create<CatalogState>()((set, get) => ({
  levels,
  modules,
  lessons,
  
  getLevelByCode: (code: LevelCode) => {
    return get().levels.find((level) => level.code === code);
  },
  
  getModuleById: (id: string) => {
    return get().modules.find((module) => module.id === id);
  },
  
  getLessonById: (id: string) => {
    return get().lessons.find((lesson) => lesson.id === id);
  },
  
  getModulesByLevel: (levelCode: LevelCode) => {
    return get().modules.filter((module) => module.level === levelCode);
  },
  
  getLessonsByModule: (moduleId: string) => {
    return get().lessons.filter((lesson) => lesson.moduleId === moduleId);
  },
}));
