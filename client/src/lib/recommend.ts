import type { LearningStats, StudentProfile, TopicProgress } from '../store/useUserStore'
import { VIDEO_POOL, worldsForSubjects, type RecommendedVideo } from '../data/subjects'

// Maps a student's onboarding profile to the video-pool's levelHint bucket,
// so recommendations lean toward content actually written for their grade/year
// instead of surfacing e.g. college ML videos to a Grade 7 student.
export function levelHintFor(profile: Pick<StudentProfile, 'level' | 'grade' | 'year'>): RecommendedVideo['levelHint'] {
  if (profile.level === 'college') return 'College'
  const gradeNum = parseInt(profile.grade?.replace(/\D/g, '') || '0')
  if (gradeNum >= 11) return 'Grade 11-12'
  if (gradeNum >= 9) return 'Grade 9-10'
  return 'Grade 6-8'
}

// Lightweight stand-in for the ML recommendation model described in the spec:
// scores each video by (weak-topic relevance) + (preference match) + (level match) - (difficulty penalty)
export function recommendVideos(
  stats: LearningStats,
  topics: TopicProgress[],
  count = 4,
  profile?: Pick<StudentProfile, 'level' | 'grade' | 'year' | 'subjects'>,
): RecommendedVideo[] {
  const weakTopicNames = topics
    .filter((t) => t.mastery < 55)
    .map((t) => t.name.toLowerCase())

  const preferShort = stats.shortVideo >= stats.longVideo
  const preferVisualInteractive = stats.visual + stats.interactive > stats.reading * 1.5
  const myLevelHint = profile ? levelHintFor(profile) : null
  // Curriculum subjects (e.g. "Concrete Technology") map onto one of the 7
  // video-pool subjects (e.g. Chemistry) via worldsForSubjects — without this,
  // a Civil Engineering student's picks never match any video's `subject`
  // field and recommendations silently default to whatever's most plentiful.
  const relevantSubjectNames =
    profile && profile.subjects.length > 0
      ? new Set(worldsForSubjects(profile.subjects, profile.level).map((w) => w.name))
      : null

  const scored = VIDEO_POOL.map((v) => {
    let score = 0
    if (weakTopicNames.some((w) => v.title.toLowerCase().includes(w.split(' ')[0]))) score += 3
    if (relevantSubjectNames && relevantSubjectNames.has(v.subject)) score += 3
    if (myLevelHint && v.levelHint === myLevelHint) score += 2.5
    if (preferShort && parseInt(v.duration) <= 9) score += 2
    if (preferVisualInteractive) score += 1.5
    if (v.difficulty === 'Beginner' && weakTopicNames.length > 0) score += 1
    score += Math.random() * 0.3
    return { v, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.v)
}

export function weakestTopic(topics: TopicProgress[]): TopicProgress | null {
  if (!topics.length) return null
  return [...topics].sort((a, b) => a.mastery - b.mastery)[0]
}

export function computeKnowledgeScore(topics: TopicProgress[]): number {
  if (!topics.length) return 0
  return Math.round(topics.reduce((sum, t) => sum + t.mastery, 0) / topics.length)
}
