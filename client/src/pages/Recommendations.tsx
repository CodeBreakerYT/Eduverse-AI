import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../store/useUserStore'
import { recommendVideos, weakestTopic } from '../lib/recommend'
import VideoCarousel from '../components/ui/VideoCarousel'
import VideoModal from '../components/ui/VideoModal'
import SubjectFilterBanner from '../components/ui/SubjectFilterBanner'
import { useActiveSubject } from '../context/SubjectContext'
import type { RecommendedVideo } from '../data/subjects'

export default function Recommendations() {
  const stats = useUserStore((s) => s.stats)
  const topics = useUserStore((s) => s.topics)
  const profile = useUserStore((s) => s.profile)
  const { activeSubject, clearActiveSubject } = useActiveSubject()
  const scopedTopics = useMemo(
    () => (activeSubject ? topics.filter((t) => t.subject === activeSubject.name) : topics),
    [topics, activeSubject],
  )
  const videos = useMemo(() => {
    const base = recommendVideos(stats, topics, 6, profile)
    return activeSubject ? base.filter((v) => v.subject === activeSubject.name) : base
  }, [stats, topics, activeSubject, profile])
  const weak = weakestTopic(scopedTopics)
  const [playing, setPlaying] = useState<RecommendedVideo | null>(null)

  const statEntries: { key: keyof typeof stats; label: string }[] = [
    { key: 'visual', label: 'Visual Learning' },
    { key: 'interactive', label: 'Interactive Learning' },
    { key: 'reading', label: 'Reading' },
    { key: 'shortVideo', label: 'Short Videos' },
    { key: 'longVideo', label: 'Long Videos' },
    { key: 'practice', label: 'Practice Challenges' },
  ]

  return (
    <div className="px-6 py-8 pb-28 md:px-10 lg:pb-10">
      <h1 className="font-display mb-2 text-3xl font-semibold">Recommendations</h1>
      <p className="mb-8 max-w-2xl text-[var(--ev-text-dim)]">
        Our ML recommendation engine blends topic relevance, performance, watch history and your learning preferences.
      </p>

      {activeSubject && <SubjectFilterBanner subject={activeSubject} onClear={clearActiveSubject} />}

      {weak && (
        <div className="glass mb-8 flex items-center gap-4 rounded-2xl border-l-4 border-l-fuchsia-400 p-5">
          <div className="text-2xl">🎯</div>
          <div>
            <div className="font-display text-sm font-semibold">Focus area: {weak.name}</div>
            <p className="text-xs text-[var(--ev-text-dim)]">
              {profile.name || 'You'} struggles with {weak.name} ({weak.mastery}% mastery). Since you learn better through{' '}
              {profile.learningPreferences.includes('interactive') ? 'short interactive content' : 'visual explanations'}, we've prioritized
              matching material below.
            </p>
          </div>
        </div>
      )}

      <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Your Learning Behaviour</h2>
          <div className="space-y-4">
            {statEntries.map((s, i) => (
              <div key={s.key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-[var(--ev-text-dim)]">{s.label}</span>
                  <span className="font-mono">{stats[s.key]}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats[s.key]}%` }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Why These Recommendations?</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><span className="text-cyan-300">•</span> Topic relevance to your weakest areas</li>
            <li className="flex gap-2"><span className="text-violet-300">•</span> Matching your preferred content length</li>
            <li className="flex gap-2"><span className="text-fuchsia-300">•</span> Aligned with your visual/interactive learning style</li>
            <li className="flex gap-2"><span className="text-amber-300">•</span> Difficulty calibrated to recent performance</li>
          </ul>
        </div>
      </div>

      {videos.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold">Recommended For You</h2>
          <VideoCarousel videos={videos} onPlay={setPlaying} />
        </div>
      )}

      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </div>
  )
}
