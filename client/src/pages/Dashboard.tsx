import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'
import { recommendVideos, weakestTopic, computeKnowledgeScore } from '../lib/recommend'
import VideoCarousel from '../components/ui/VideoCarousel'
import VideoModal from '../components/ui/VideoModal'
import KnowledgeConstellation from '../components/three/KnowledgeConstellation'
import { planetsForSubjects, type RecommendedVideo } from '../data/subjects'
import { ArrowUpRight } from 'lucide-react'

export default function Dashboard() {
  const profile = useUserStore((s) => s.profile)
  const stats = useUserStore((s) => s.stats)
  const topics = useUserStore((s) => s.topics)
  const gamification = useUserStore((s) => s.gamification)
  const navigate = useNavigate()
  const [playing, setPlaying] = useState<RecommendedVideo | null>(null)

  const videos = recommendVideos(stats, topics, 4, profile)
  const weak = weakestTopic(topics)
  const knowledgeScore = computeKnowledgeScore(topics)
  const worlds = planetsForSubjects(profile.subjects, profile.level);

  return (
    <div className="px-6 py-8 pb-28 md:px-10 lg:pb-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="mb-1 text-sm text-[var(--ev-text-dim)]">Welcome back,</p>
        <h1 className="font-display text-3xl font-semibold md:text-4xl">
          {profile.name || 'Explorer'} <span className="ev-gradient-text">✦</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--ev-text-dim)]">
          {topics.length === 0 ? (
            <>Your universe is empty so far — fly into a planet or start a game to begin building your knowledge map.</>
          ) : (
            <>
              Based on your recent progress, <span className="text-cyan-300">{topics[0]?.subject}</span> and{' '}
              <span className="text-violet-300">{weak?.name}</span> are recommended today.
            </>
          )}
        </p>
      </motion.div>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Knowledge Score" value={`${knowledgeScore}%`} accent="cyan" />
        <StatTile label="XP" value={gamification.xp.toLocaleString()} accent="violet" />
        <StatTile label="Streak" value={`${gamification.streak} days`} accent="amber" />
        <StatTile label="Level" value={`${gamification.level}`} accent="magenta" />
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="glass rounded-2xl p-5 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Knowledge Constellation</h2>
            <button onClick={() => navigate('/progress')} className="flex items-center gap-1 text-xs text-[var(--ev-text-dim)] hover:text-white">
              View progress <ArrowUpRight size={14} />
            </button>
          </div>
          {topics.length > 0 ? (
            <KnowledgeConstellation topics={topics} />
          ) : (
            <div className="flex h-[420px] flex-col items-center justify-center gap-2 text-center">
              <span className="text-3xl">✦</span>
              <p className="text-sm text-[var(--ev-text-dim)]">No stars yet — mastery you earn from lessons, practice and games will appear here.</p>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h2 className="mb-3 font-display text-lg font-semibold">Current Learning Path</h2>
          {topics.length === 0 ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-center">
              <span className="text-3xl">🚀</span>
              <p className="text-sm text-[var(--ev-text-dim)]">Enter a world or play a game to start your learning path.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topics
                .slice()
                .sort((a, b) => a.mastery - b.mastery)
                .slice(0, 4)
                .map((t, i) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/30 to-violet-500/30 text-xs font-semibold">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{t.name}</div>
                      <div className="text-[11px] text-[var(--ev-text-dim)]">{t.subject}</div>
                    </div>
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${t.mastery}%` }} />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <motion.button
        onClick={() => navigate('/games')}
        whileHover={{ y: -3 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass relative mb-10 flex w-full items-center gap-4 overflow-hidden rounded-2xl p-5 text-left"
      >
        <div className="absolute -right-6 -top-10 h-36 w-36 rounded-full bg-amber-400 opacity-20 blur-3xl" />
        <div className="relative text-4xl">🎮</div>
        <div className="relative flex-1">
          <div className="font-display text-base font-semibold">Play & Learn</div>
          <p className="text-xs text-[var(--ev-text-dim)]">Sort Rush and Math Runner — earn XP while you play</p>
        </div>
        <span className="relative rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-xs font-semibold text-black">
          Play now →
        </span>
      </motion.button>

      <div className="mb-10">
        <h2 className="mb-4 font-display text-lg font-semibold">Enter Your Learning World</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {worlds.map((w, i) => (
            <motion.button
              key={w.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6, boxShadow: `0 0 40px ${w.color}30` }}
              onClick={() => navigate(w.route)}
              className="glass flex flex-col items-start rounded-2xl p-5 text-left"
              style={{ boxShadow: `inset 0 0 0 1px ${w.color}20` }}
            >
              <div className="mb-3 text-3xl">{w.icon}</div>
              <div className="font-display text-sm font-semibold">{w.name}</div>
              <div className="mt-1 text-[11px] text-[var(--ev-text-dim)]">{w.tagline}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold">Recommended For You</h2>
        <VideoCarousel videos={videos} onPlay={setPlaying} />
      </div>

      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </div>
  )
}

function StatTile({ label, value, accent }: { label: string; value: string; accent: 'cyan' | 'violet' | 'amber' | 'magenta' }) {
  const colors: Record<string, string> = {
    cyan: 'text-cyan-300',
    violet: 'text-violet-300',
    amber: 'text-amber-300',
    magenta: 'text-fuchsia-300',
  }
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[11px] uppercase tracking-wide text-[var(--ev-text-dim)]">{label}</div>
      <div className={`font-display mt-1 text-2xl font-semibold ${colors[accent]}`}>{value}</div>
    </div>
  )
}
