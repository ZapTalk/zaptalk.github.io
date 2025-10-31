/**
 * Gamification System Types
 * Defines all types for XP, levels, achievements, streaks, and roadmap features
 */

export type AchievementCategory = 
  | 'milestone' 
  | 'streak' 
  | 'speed' 
  | 'perfection' 
  | 'explorer'
  | 'dedication';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpReward: number;
  icon: string;
  unlockedAt?: number; // timestamp
  progress?: number; // 0-100
  requirement: number; // what value is needed to unlock
  currentValue?: number; // current progress toward requirement
}

export interface UserLevel {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
}

export interface XPTransaction {
  id: string;
  amount: number;
  reason: string;
  timestamp: number;
  lessonId?: string;
}

export interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string; // ISO date string
  freezesAvailable: number;
  totalDaysStudied: number;
}

export interface DailyGoal {
  lessonsTarget: number;
  minutesTarget: number;
  lessonsCompleted: number;
  minutesCompleted: number;
  date: string; // ISO date string
  achieved: boolean;
}

export interface StudySession {
  id: string;
  lessonId: string;
  startTime: number;
  endTime?: number;
  duration: number; // in seconds
  completed: boolean;
  xpEarned: number;
  quizScore?: number;
}

export interface WeeklyPlan {
  weekStart: string; // ISO date string
  weekEnd: string;
  goals: {
    monday: DailyGoal;
    tuesday: DailyGoal;
    wednesday: DailyGoal;
    thursday: DailyGoal;
    friday: DailyGoal;
    saturday: DailyGoal;
    sunday: DailyGoal;
  };
  totalXPEarned: number;
  goalsAchieved: number;
  totalGoals: number;
}

export interface RoadmapNode {
  lessonId: string;
  level: string; // A1, A2, etc.
  moduleId: string;
  position: { x: number; y: number };
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  dependencies: string[]; // lesson IDs that must be completed first
  xpReward: number;
}

export interface LevelProgress {
  level: string; // A1, A2, etc.
  totalLessons: number;
  completedLessons: number;
  unlockedLessons: number;
  lockedLessons: number;
  progressPercentage: number;
  estimatedTimeHours: number;
  xpEarned: number;
  totalXPAvailable: number;
}

export interface LeaderboardEntry {
  rank: number;
  pubkey: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  achievements: number;
  streak: number;
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all-time';
export type LeaderboardScope = 'global' | 'level' | 'friends';

export interface GamificationStats {
  // Core Stats
  totalXP: number;
  currentLevel: number;
  levelTitle: string;
  xpToNextLevel: number;
  xpProgress: number; // percentage 0-100
  
  // Study Stats
  totalStudyMinutes: number;
  totalLessonsCompleted: number;
  averageQuizScore: number;
  perfectScores: number;
  
  // Streak Stats
  currentStreak: number;
  longestStreak: number;
  streakFreezesAvailable: number;
  
  // Achievements
  achievementsUnlocked: number;
  totalAchievements: number;
  achievementsByCategory: Record<AchievementCategory, number>;
  
  // Progress
  cefrProgress: Record<string, LevelProgress>;
  overallProgress: number; // 0-100
  
  // Rankings
  globalRank?: number;
  levelRank?: number;
  
  // Recent Activity
  recentXPTransactions: XPTransaction[];
  recentAchievements: Achievement[];
  recentSessions: StudySession[];
}

export interface GamificationState {
  // User Progress
  xp: number;
  level: number;
  achievements: Achievement[];
  streak: DailyStreak;
  
  // Study Data
  sessions: StudySession[];
  xpTransactions: XPTransaction[];
  dailyGoals: Record<string, DailyGoal>; // key is date string
  weeklyPlans: WeeklyPlan[];
  
  // Current State
  activeSession?: StudySession;
  todayGoal?: DailyGoal;
  
  // Stats Cache
  stats?: GamificationStats;
  lastUpdated: number;
}

// XP Reward Values
export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_PERFECT: 25,
  QUIZ_GOOD: 15, // 80-99%
  QUIZ_PASS: 10, // 60-79%
  DAILY_GOAL: 30,
  WEEKLY_GOAL: 100,
  STREAK_MILESTONE_3: 20,
  STREAK_MILESTONE_7: 50,
  STREAK_MILESTONE_30: 200,
  STREAK_MILESTONE_100: 1000,
  LEVEL_UNLOCK: 100, // Unlock all lessons in a CEFR level
  FIRST_LESSON: 10,
  SPEED_BONUS: 20, // Complete lesson in < 3 minutes
} as const;

// Level Titles
export const LEVEL_TITLES: Record<number, string> = {
  1: 'Novice',
  5: 'Learner',
  10: 'Student',
  15: 'Apprentice',
  20: 'Practitioner',
  25: 'Skilled',
  30: 'Adept',
  35: 'Expert',
  40: 'Specialist',
  45: 'Professional',
  50: 'Master',
  60: 'Grand Master',
  70: 'Legend',
  80: 'Champion',
  90: 'Virtuoso',
  100: 'Grandmaster',
};

// XP required for each level (exponential curve)
export const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.15, level - 1));
};

// Get total XP needed to reach a level
export const getTotalXPForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += calculateXPForLevel(i);
  }
  return total;
};

// Get level from total XP
export const getLevelFromXP = (xp: number): number => {
  let level = 1;
  let totalXP = 0;
  
  while (totalXP <= xp) {
    totalXP += calculateXPForLevel(level + 1);
    if (totalXP <= xp) {
      level++;
    }
  }
  
  return level;
};

// Get level title
export const getLevelTitle = (level: number): string => {
  const milestones = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const milestone of milestones) {
    if (level >= milestone) {
      return LEVEL_TITLES[milestone];
    }
  }
  
  return LEVEL_TITLES[1];
};
