import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type EduLevel = 'school' | 'college'

export interface StudentProfile {
  name: string
  level: EduLevel
  grade?: string // school
  course?: string // college
  year?: string // college
  subjects: string[]
  learningPreferences: string[]
  onboardingComplete: boolean
}

export interface LearningStats {
  visual: number
  interactive: number
  reading: number
  shortVideo: number
  longVideo: number
  practice: number
}

export interface TopicProgress {
  id: string
  subject: string
  name: string
  mastery: number // 0-100
  lastVisited: number
  status: 'locked' | 'available' | 'in-progress' | 'mastered'
}

export interface GamificationState {
  xp: number
  level: number
  streak: number
  lastActiveDate: string | null
  achievements: string[]
}

interface UserState {
  profile: StudentProfile
  stats: LearningStats
  topics: TopicProgress[]
  gamification: GamificationState
  chatHistory: { role: 'user' | 'assistant'; text: string }[]

  setName: (name: string) => void
  setLevel: (level: EduLevel) => void
  setGrade: (grade: string) => void
  setCourseInfo: (course: string, year: string) => void
  toggleSubject: (subject: string) => void
  setSubjects: (subjects: string[]) => void
  togglePreference: (pref: string) => void
  completeOnboarding: () => void
  resetOnboarding: () => void

  addXP: (amount: number) => void
  touchStreak: () => void
  unlockAchievement: (id: string) => void
  updateTopicMastery: (id: string, subject: string, name: string, delta: number) => void

  pushChat: (role: 'user' | 'assistant', text: string) => void
  clearChat: () => void
}

const defaultProfile: StudentProfile = {
  name: '',
  level: 'college',
  subjects: [],
  learningPreferences: [],
  onboardingComplete: false,
}

// New accounts start with zero tracked behaviour and zero topics — these
// only grow as the student actually watches videos, plays games, and
// answers practice questions (see updateTopicMastery / addXP callers).
const defaultStats: LearningStats = {
  visual: 0,
  interactive: 0,
  reading: 0,
  shortVideo: 0,
  longVideo: 0,
  practice: 0,
}

const seedTopics: TopicProgress[] = []

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      stats: defaultStats,
      topics: seedTopics,
      gamification: { xp: 0, level: 1, streak: 0, lastActiveDate: null, achievements: [] },
      chatHistory: [],

      setName: (name) => set((s) => ({ profile: { ...s.profile, name } })),
      setLevel: (level) => set((s) => ({ profile: { ...s.profile, level } })),
      setGrade: (grade) => set((s) => ({ profile: { ...s.profile, grade } })),
      setCourseInfo: (course, year) => set((s) => ({ profile: { ...s.profile, course, year } })),
      toggleSubject: (subject) =>
        set((s) => {
          const has = s.profile.subjects.includes(subject)
          return {
            profile: {
              ...s.profile,
              subjects: has ? s.profile.subjects.filter((x) => x !== subject) : [...s.profile.subjects, subject],
            },
          }
        }),
      setSubjects: (subjects) => set((s) => ({ profile: { ...s.profile, subjects } })),
      togglePreference: (pref) =>
        set((s) => {
          const has = s.profile.learningPreferences.includes(pref)
          return {
            profile: {
              ...s.profile,
              learningPreferences: has
                ? s.profile.learningPreferences.filter((x) => x !== pref)
                : [...s.profile.learningPreferences, pref],
            },
          }
        }),
      completeOnboarding: () =>
        set((s) => ({
          profile: { ...s.profile, onboardingComplete: true },
          // Finishing onboarding is the first real, earned achievement —
          // everything after this is built up from actual activity.
          gamification: {
            ...s.gamification,
            xp: s.gamification.xp + 20,
            streak: 1,
            lastActiveDate: new Date().toDateString(),
            achievements: s.gamification.achievements.includes('first-steps')
              ? s.gamification.achievements
              : [...s.gamification.achievements, 'first-steps'],
          },
        })),
      resetOnboarding: () => set({ profile: defaultProfile }),

      addXP: (amount) =>
        set((s) => {
          const xp = s.gamification.xp + amount
          const level = Math.floor(xp / 500) + 1
          return { gamification: { ...s.gamification, xp, level } }
        }),
      touchStreak: () =>
        set((s) => {
          const today = new Date().toDateString()
          if (s.gamification.lastActiveDate === today) return {}
          return { gamification: { ...s.gamification, streak: s.gamification.streak + 1, lastActiveDate: today } }
        }),
      unlockAchievement: (id) =>
        set((s) => ({
          gamification: {
            ...s.gamification,
            achievements: s.gamification.achievements.includes(id)
              ? s.gamification.achievements
              : [...s.gamification.achievements, id],
          },
        })),
      updateTopicMastery: (id, subject, name, delta) =>
        set((s) => {
          const existing = s.topics.find((t) => t.id === id)
          if (existing) {
            const mastery = Math.max(0, Math.min(100, existing.mastery + delta))
            return {
              topics: s.topics.map((t) =>
                t.id === id
                  ? { ...t, mastery, lastVisited: Date.now(), status: mastery >= 90 ? 'mastered' : 'in-progress' }
                  : t,
              ),
            }
          }
          return {
            topics: [
              ...s.topics,
              { id, subject, name, mastery: Math.max(0, delta), lastVisited: Date.now(), status: 'in-progress' },
            ],
          }
        }),

      pushChat: (role, text) => set((s) => ({ chatHistory: [...s.chatHistory, { role, text }] })),
      clearChat: () => set({ chatHistory: [] }),
    }),
    { name: 'eduverse-ai-store' },
  ),
)
