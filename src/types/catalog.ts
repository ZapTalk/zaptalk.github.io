export type LevelCode = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LessonKind = 'grammar' | 'reading' | 'listening' | 'speaking' | 'vocab' | 'story';

export interface QuizItem {
  id: string;
  type: 'multiple-choice' | 'gap-fill' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

export interface LessonContent {
  html?: string;
  audioUrl?: string;
  quiz?: QuizItem[];
  story?: {
    text: string;
    translation?: string;
  };
}

export interface Lesson {
  id: string;
  level: LevelCode;
  moduleId: string;
  title: string;
  kind: LessonKind;
  isFree: boolean;
  priceSats: number;
  durationMin: number;
  content: LessonContent;
  description?: string;
  objectives?: string[];
}

export interface Module {
  id: string;
  level: LevelCode;
  title: string;
  description?: string;
  lessonIds: string[];
}

export interface Level {
  code: LevelCode;
  title: string;
  description?: string;
  moduleIds: string[];
}

export type SkuType = 'lesson' | 'module' | 'level';

export interface Sku {
  id: string;
  type: SkuType;
  refId: string;
  priceSats: number;
  displayName: string;
  description?: string;
}

export type EntitlementSource = 'nostr-zap' | 'webln-invoice';

export interface Entitlement {
  skuId: string;
  grantedAt: string;
  source: EntitlementSource;
  nostrEventId?: string;
}

export interface UserProgress {
  lessonId: string;
  completed: boolean;
  score?: number;
  lastAccessedAt: string;
}
