import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../store/useUserStore'
import KnowledgeConstellation from '../components/three/KnowledgeConstellation'
import SubjectFilterBanner from '../components/ui/SubjectFilterBanner'
import { useActiveSubject } from '../context/SubjectContext'
import { computeKnowledgeScore } from '../lib/recommend'

const ACHIEVEMENTS = [
  { id: 'first-steps', name: 'First Steps', desc: 'Completed onboarding', icon: '✦' },
  { id: 'sorter', name: 'Sort Master', desc: 'Mastered Sorting Algorithms', icon: '⚡' },
  { id: 'graph-explorer', name: 'Graph Explorer', desc: 'Complete BFS, DFS & Dijkstra', icon: '🕸' },
  { id: 'streak-7', name: 'Week Warrior', desc: '7 day learning streak', icon: '🔥' },
]

export default function Progress() {
  const allTopics = useUserStore((s) => s.topics)
  const gamification = useUserStore((s) => s.gamification)
  const { activeSubject, clearActiveSubject } = useActiveSubject()
  const topics = useMemo(
    () => (activeSubject ? allTopics.filter((t) => t.subject === activeSubject.name) : allTopics),
    [allTopics, activeSubject],
  )
  const score = computeKnowledgeScore(topics)

  const bySubject = topics.reduce<Record<string, typeof topics>>((acc, t) => {
    acc[t.subject] = acc[t.subject] || []
    acc[t.subject].push(t)
    return acc
  }, {})

  return (
    <div className="px-6 py-8 pb-28 md:px-10 lg:pb-10">
      <h1 className="font-display mb-2 text-3xl font-semibold">Progress</h1>
      <p className="mb-8 text-[var(--ev-text-dim)]">Your evolving knowledge map — not just numbers, a living universe of mastery.</p>

      {activeSubject && <SubjectFilterBanner subject={activeSubject} onClear={clearActiveSubject} />}

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Knowledge Score" value={`${score}%`} color="text-cyan-300" />
        <Stat label="Total XP" value={gamification.xp.toLocaleString()} color="text-violet-300" />
        <Stat label="Learning Level" value={`${gamification.level}`} color="text-fuchsia-300" />
        <Stat label="Streak" value={`${gamification.streak} days`} color="text-amber-300" />
      </div>

      <div className="glass mb-10 rounded-2xl p-5">
        <h2 className="mb-3 font-display text-lg font-semibold">Knowledge Constellation</h2>
        {topics.length > 0 ? (
          <KnowledgeConstellation topics={topics} />
        ) : (
          <p className="py-12 text-center text-sm text-[var(--ev-text-dim)]">
            {activeSubject ? `No tracked topics for ${activeSubject.name} yet — go practice a bit!` : 'No topics tracked yet — explore a world, play a game, or ask the AI Tutor to get started.'}
          </p>
        )}
      </div>

      <div className="mb-10">
        <h2 className="mb-4 font-display text-lg font-semibold">Mastery by Subject</h2>
        {topics.length === 0 ? (
          <p className="text-sm text-[var(--ev-text-dim)]">Nothing here yet — your mastery breakdown will appear as you learn.</p>
        ) : (
        <div className="space-y-6">
          {Object.entries(bySubject).map(([subject, ts]) => (
            <div key={subject} className="glass rounded-2xl p-5">
              <h3 className="mb-3 font-display text-sm font-semibold">{subject}</h3>
              <div className="space-y-3">
                {ts.map((t) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 truncate text-xs text-[var(--ev-text-dim)]">{t.name}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${t.mastery}%` }}
                        className={`h-full rounded-full ${
                          t.status === 'mastered' ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' : 'bg-gradient-to-r from-violet-400 to-fuchsia-400'
                        }`}
                      />
                    </div>
                    <span className="w-10 text-right font-mono text-xs">{t.mastery}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold">Achievements</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = gamification.achievements.includes(a.id)
            return (
              <div key={a.id} className={`glass rounded-2xl p-4 text-center transition ${unlocked ? '' : 'opacity-35 grayscale'}`}>
                <div className="mb-2 text-3xl">{a.icon}</div>
                <div className="font-display text-xs font-semibold">{a.name}</div>
                <div className="mt-1 text-[10px] text-[var(--ev-text-dim)]">{a.desc}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[11px] uppercase tracking-wide text-[var(--ev-text-dim)]">{label}</div>
      <div className={`font-display mt-1 text-2xl font-semibold ${color}`}>{value}</div>
    </div>
  )
}
