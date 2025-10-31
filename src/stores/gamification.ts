import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GamificationState,
  XPTransaction,
  StudySession,
  DailyGoal,
  Achievement,
  DailyStreak,
  GamificationStats,
} from '@/types/gamification';
import {
  getLevelFromXP,
  getLevelTitle,
  calculateXPForLevel,
  getTotalXPForLevel,
  XP_REWARDS,
} from '@/types/gamification';
import { ACHIEVEMENTS } from '@/data/achievements';

interface GamificationStore extends GamificationState {
  // Actions
  addXP: (amount: number, reason: string, lessonId?: string) => void;
  addAchievement: (achievementId: string) => void;
  startSession: (lessonId: string) => void;
  endSession: (completed: boolean, quizScore?: number) => void;
  updateStreak: () => void;
  setDailyGoal: (lessonsTarget: number, minutesTarget: number) => void;
  updateDailyProgress: (lessonsCompleted: number, minutesCompleted: number) => void;
  checkAchievements: () => void;
  getStats: () => Partial<GamificationStats>;
  resetProgress: () => void;
}

const initialState: GamificationState = {
  xp: 0,
  level: 1,
  achievements: [],
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: '',
    freezesAvailable: 2,
    totalDaysStudied: 0,
  },
  sessions: [],
  xpTransactions: [],
  dailyGoals: {},
  weeklyPlans: [],
  lastUpdated: Date.now(),
};

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addXP: (amount: number, reason: string, lessonId?: string) => {
        const transaction: XPTransaction = {
          id: `xp-${Date.now()}-${Math.random()}`,
          amount,
          reason,
          timestamp: Date.now(),
          lessonId,
        };

        set((state) => {
          const newXP = state.xp + amount;
          const oldLevel = state.level;
          const newLevel = getLevelFromXP(newXP);
          
          // Check for level up
          const _leveledUp = newLevel > oldLevel;

          return {
            xp: newXP,
            level: newLevel,
            xpTransactions: [transaction, ...state.xpTransactions].slice(0, 100), // Keep last 100
            lastUpdated: Date.now(),
          };
        });

        // Check for achievements after XP is added
        get().checkAchievements();
      },

      addAchievement: (achievementId: string) => {
        set((state) => {
          // Check if already unlocked
          if (state.achievements.some((a) => a.id === achievementId)) {
            return state;
          }

          const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
          if (!achievement) {
            return state;
          }

          const unlockedAchievement: Achievement = {
            ...achievement,
            unlockedAt: Date.now(),
            progress: 100,
            currentValue: achievement.requirement,
          };

          // Award XP for achievement
          const transaction: XPTransaction = {
            id: `xp-achievement-${Date.now()}`,
            amount: achievement.xpReward,
            reason: `Achievement: ${achievement.title}`,
            timestamp: Date.now(),
          };

          const newXP = state.xp + achievement.xpReward;
          const newLevel = getLevelFromXP(newXP);

          return {
            achievements: [...state.achievements, unlockedAchievement],
            xp: newXP,
            level: newLevel,
            xpTransactions: [transaction, ...state.xpTransactions].slice(0, 100),
            lastUpdated: Date.now(),
          };
        });
      },

      startSession: (lessonId: string) => {
        const session: StudySession = {
          id: `session-${Date.now()}`,
          lessonId,
          startTime: Date.now(),
          duration: 0,
          completed: false,
          xpEarned: 0,
        };

        set({ activeSession: session });
      },

      endSession: (completed: boolean, quizScore?: number) => {
        set((state) => {
          if (!state.activeSession) return state;

          const endTime = Date.now();
          const duration = Math.floor((endTime - state.activeSession.startTime) / 1000);

          let xpEarned = 0;
          if (completed) {
            xpEarned += XP_REWARDS.LESSON_COMPLETE;

            if (quizScore !== undefined) {
              if (quizScore === 100) {
                xpEarned += XP_REWARDS.QUIZ_PERFECT;
              } else if (quizScore >= 80) {
                xpEarned += XP_REWARDS.QUIZ_GOOD;
              } else if (quizScore >= 60) {
                xpEarned += XP_REWARDS.QUIZ_PASS;
              }
            }

            // Speed bonus (completed in under 3 minutes)
            if (duration < 180) {
              xpEarned += XP_REWARDS.SPEED_BONUS;
            }
          }

          const completedSession: StudySession = {
            ...state.activeSession,
            endTime,
            duration,
            completed,
            xpEarned,
            quizScore,
          };

          const newSessions = [completedSession, ...state.sessions].slice(0, 200);

          // Update daily progress
          const today = new Date().toISOString().split('T')[0];
          const todayGoal = state.dailyGoals[today];
          
          if (todayGoal && completed) {
            const updatedGoal: DailyGoal = {
              ...todayGoal,
              lessonsCompleted: todayGoal.lessonsCompleted + 1,
              minutesCompleted: todayGoal.minutesCompleted + Math.floor(duration / 60),
              achieved:
                todayGoal.lessonsCompleted + 1 >= todayGoal.lessonsTarget &&
                todayGoal.minutesCompleted + Math.floor(duration / 60) >= todayGoal.minutesTarget,
            };

            return {
              activeSession: undefined,
              sessions: newSessions,
              dailyGoals: {
                ...state.dailyGoals,
                [today]: updatedGoal,
              },
              lastUpdated: Date.now(),
            };
          }

          return {
            activeSession: undefined,
            sessions: newSessions,
            lastUpdated: Date.now(),
          };
        });

        // Add XP if session was completed
        const state = get();
        if (completed && state.sessions[0]) {
          get().addXP(
            state.sessions[0].xpEarned,
            'Lesson completed',
            state.sessions[0].lessonId
          );
        }

        // Update streak
        if (completed) {
          get().updateStreak();
        }

        // Check achievements
        get().checkAchievements();
      },

      updateStreak: () => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];

          const newStreak: DailyStreak = { ...state.streak };

          // If already completed today, don't update
          if (newStreak.lastCompletedDate === today) {
            return state;
          }

          // If completed yesterday, increment streak
          if (newStreak.lastCompletedDate === yesterday) {
            newStreak.currentStreak += 1;
            newStreak.longestStreak = Math.max(
              newStreak.longestStreak,
              newStreak.currentStreak
            );
          } else if (newStreak.lastCompletedDate < yesterday) {
            // Streak broken, check if we have freezes
            if (newStreak.freezesAvailable > 0) {
              newStreak.freezesAvailable -= 1;
              newStreak.currentStreak += 1;
            } else {
              newStreak.currentStreak = 1;
            }
          } else {
            // First day
            newStreak.currentStreak = 1;
          }

          newStreak.lastCompletedDate = today;
          newStreak.totalDaysStudied += 1;

          return {
            streak: newStreak,
            lastUpdated: Date.now(),
          };
        });

        // Check for streak achievements
        get().checkAchievements();
      },

      setDailyGoal: (lessonsTarget: number, minutesTarget: number) => {
        const today = new Date().toISOString().split('T')[0];

        set((state) => ({
          dailyGoals: {
            ...state.dailyGoals,
            [today]: {
              lessonsTarget,
              minutesTarget,
              lessonsCompleted: 0,
              minutesCompleted: 0,
              date: today,
              achieved: false,
            },
          },
          todayGoal: {
            lessonsTarget,
            minutesTarget,
            lessonsCompleted: 0,
            minutesCompleted: 0,
            date: today,
            achieved: false,
          },
          lastUpdated: Date.now(),
        }));
      },

      updateDailyProgress: (lessonsCompleted: number, minutesCompleted: number) => {
        const today = new Date().toISOString().split('T')[0];

        set((state) => {
          const todayGoal = state.dailyGoals[today];
          if (!todayGoal) return state;

          const updatedGoal: DailyGoal = {
            ...todayGoal,
            lessonsCompleted,
            minutesCompleted,
            achieved:
              lessonsCompleted >= todayGoal.lessonsTarget &&
              minutesCompleted >= todayGoal.minutesTarget,
          };

          return {
            dailyGoals: {
              ...state.dailyGoals,
              [today]: updatedGoal,
            },
            todayGoal: updatedGoal,
            lastUpdated: Date.now(),
          };
        });
      },

      checkAchievements: () => {
        const state = get();
        const completedLessons = state.sessions.filter((s) => s.completed).length;
        const perfectScores = state.sessions.filter((s) => s.quizScore === 100).length;
        const speedLessons = state.sessions.filter(
          (s) => s.completed && s.duration < 180
        ).length;

        // Check lesson milestones
        const milestones = [1, 5, 10, 25, 50, 100, 250];
        milestones.forEach((milestone) => {
          if (completedLessons >= milestone) {
            get().addAchievement(`lessons-${milestone}`);
          }
        });

        // Check streak achievements
        const streakMilestones = [3, 7, 14, 30, 60, 100, 365];
        streakMilestones.forEach((milestone) => {
          if (state.streak.currentStreak >= milestone) {
            get().addAchievement(`streak-${milestone}`);
          }
        });

        // Check perfection achievements
        const perfectMilestones = [1, 5, 10, 25, 50];
        perfectMilestones.forEach((milestone) => {
          if (perfectScores >= milestone) {
            if (milestone === 1) {
              get().addAchievement('perfect-score');
            } else {
              get().addAchievement(`perfect-${milestone}`);
            }
          }
        });

        // Check speed achievements
        if (speedLessons >= 10) {
          get().addAchievement('speed-demon');
        }
        if (speedLessons >= 25) {
          get().addAchievement('lightning-fast');
        }
      },

      getStats: () => {
        const state = get();
        const completedSessions = state.sessions.filter((s) => s.completed);
        const totalMinutes = completedSessions.reduce((sum, s) => sum + s.duration / 60, 0);
        const avgScore =
          completedSessions.filter((s) => s.quizScore !== undefined).length > 0
            ? completedSessions.reduce((sum, s) => sum + (s.quizScore || 0), 0) /
              completedSessions.filter((s) => s.quizScore !== undefined).length
            : 0;

        const xpToNextLevel = calculateXPForLevel(state.level + 1);
        const currentLevelXP = getTotalXPForLevel(state.level);
        const xpProgress = ((state.xp - currentLevelXP) / xpToNextLevel) * 100;

        return {
          totalXP: state.xp,
          currentLevel: state.level,
          levelTitle: getLevelTitle(state.level),
          xpToNextLevel,
          xpProgress,
          totalStudyMinutes: Math.floor(totalMinutes),
          totalLessonsCompleted: completedSessions.length,
          averageQuizScore: Math.round(avgScore),
          perfectScores: completedSessions.filter((s) => s.quizScore === 100).length,
          currentStreak: state.streak.currentStreak,
          longestStreak: state.streak.longestStreak,
          streakFreezesAvailable: state.streak.freezesAvailable,
          achievementsUnlocked: state.achievements.length,
          totalAchievements: ACHIEVEMENTS.length,
          recentXPTransactions: state.xpTransactions.slice(0, 5),
          recentAchievements: state.achievements.slice(-5).reverse(),
          recentSessions: completedSessions.slice(0, 5),
        };
      },

      resetProgress: () => {
        set(initialState);
      },
    }),
    {
      name: 'gamification-storage',
      version: 1,
    }
  )
);
