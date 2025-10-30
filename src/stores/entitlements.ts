import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Entitlement, UserProgress } from '@/types/catalog';
import { lessons } from '@/data/lessons';

interface EntitlementsState {
  entitlements: Entitlement[];
  progress: UserProgress[];
  
  grant: (skuId: string, source: Entitlement['source'], nostrEventId?: string) => void;
  has: (skuId: string) => boolean;
  hasAccess: (lessonId: string) => boolean;
  
  updateProgress: (lessonId: string, completed: boolean, score?: number) => void;
  getProgress: (lessonId: string) => UserProgress | undefined;
}

export const useEntitlementsStore = create<EntitlementsState>()(
  persist(
    (set, get) => ({
      entitlements: [],
      progress: [],
      
      grant: (skuId: string, source: Entitlement['source'], nostrEventId?: string) => {
        set((state) => {
          // Check if already granted
          if (state.entitlements.some((e) => e.skuId === skuId)) {
            return state;
          }
          
          return {
            entitlements: [
              ...state.entitlements,
              {
                skuId,
                grantedAt: new Date().toISOString(),
                source,
                nostrEventId,
              },
            ],
          };
        });
      },
      
      has: (skuId: string) => {
        return get().entitlements.some((e) => e.skuId === skuId);
      },
      
      hasAccess: (lessonId: string) => {
        const lesson = lessons.find((l) => l.id === lessonId);
        if (!lesson) return false;
        
        // Free lessons are always accessible
        if (lesson.isFree) return true;
        
        const { has } = get();
        
        // Check if owns specific lesson
        if (has(`sku-lesson-${lessonId}`)) return true;
        
        // Check if owns module
        if (has(`sku-module-${lesson.moduleId}`)) return true;
        
        // Check if owns level
        if (has(`sku-level-${lesson.level}`)) return true;
        
        return false;
      },
      
      updateProgress: (lessonId: string, completed: boolean, score?: number) => {
        set((state) => {
          const existingIndex = state.progress.findIndex((p) => p.lessonId === lessonId);
          
          const newProgress: UserProgress = {
            lessonId,
            completed,
            score,
            lastAccessedAt: new Date().toISOString(),
          };
          
          if (existingIndex >= 0) {
            const updated = [...state.progress];
            updated[existingIndex] = newProgress;
            return { progress: updated };
          }
          
          return {
            progress: [...state.progress, newProgress],
          };
        });
      },
      
      getProgress: (lessonId: string) => {
        return get().progress.find((p) => p.lessonId === lessonId);
      },
    }),
    {
      name: 'zaptalk-entitlements',
    }
  )
);
