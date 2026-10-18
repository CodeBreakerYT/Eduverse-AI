import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useUserStore } from '../store/useUserStore'
import { recommendVideos } from '../lib/recommend'
import VideoCarousel from '../components/ui/VideoCarousel'
import VideoModal from '../components/ui/VideoModal'
import SubjectFilterBanner from '../components/ui/SubjectFilterBanner'
import { useActiveSubject } from '../context/SubjectContext'
import { VIDEO_POOL, type RecommendedVideo } from '../data/subjects'

export default function Explore() {
  const profile = useUserStore((s) => s.profile)
  const stats = useUserStore((s) => s.stats)
  const topics = useUserStore((s) => s.topics)
  const { activeSubject, clearActiveSubject } = useActiveSubject()
  const [playing, setPlaying] = useState<RecommendedVideo | null>(null)

  const pool = useMemo(
    () => (activeSubject ? VIDEO_POOL.filter((v) => v.subject === activeSubject.name) : VIDEO_POOL),
    [activeSubject],
  )
  const groupedByTopic = useMemo(() => {
    const groups = new Map<string, RecommendedVideo[]>()
    pool.forEach((v) => {
      if (!groups.has(v.topic)) groups.set(v.topic, [])
      groups.get(v.topic)!.push(v)
    })
    return Array.from(groups.entries())
  }, [pool])
  const recommended = useMemo(() => {
    const base = recommendVideos(stats, topics, 6, profile)
    return activeSubject ? base.filter((v) => v.subject === activeSubject.name) : base
  }, [stats, topics, activeSubject, profile])

  return (
    <div className="px-6 py-8 pb-28 md:px-10 lg:pb-10">
      <h1 className="font-display mb-2 text-3xl font-semibold">Explore</h1>
      <p className="mb-8 text-[var(--ev-text-dim)]">Discover new content curated by EduVerse AI's recommendation engine.</p>

      {activeSubject && <SubjectFilterBanner subject={activeSubject} onClear={clearActiveSubject} />}

      {recommended.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 font-display text-lg font-semibold">Curated For You</h2>
          <VideoCarousel videos={recommended} onPlay={setPlaying} />
        </div>
      )}

      <div className="space-y-10">
        <h2 className="font-display text-lg font-semibold">All Content, by Topic</h2>
        {pool.length === 0 ? (
          <p className="text-sm text-[var(--ev-text-dim)]">No {activeSubject?.name} videos yet — check back soon.</p>
        ) : (
          groupedByTopic.map(([topic, vids]) => (
            <div key={topic}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--ev-text-dim)]">{topic}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {vids.map((v, i) => (
                  <motion.button
                    key={v.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setPlaying(v)}
                    className="glass group overflow-hidden rounded-2xl text-left"
                  >
                    <div className="relative h-28 overflow-hidden bg-black">
                      <img
                        src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                        alt={v.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur transition group-hover:scale-110 group-hover:bg-white/30">
                          <Play size={16} className="ml-0.5 text-white" fill="white" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] text-white">{v.duration}</span>
                      <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] text-white">{v.levelHint}</span>
                    </div>
                    <div className="p-4">
                      <div className="mb-1 text-[11px] uppercase tracking-wide text-[var(--ev-text-dim)]">{v.subject}</div>
                      <h3 className="font-display text-sm font-semibold">{v.title}</h3>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--ev-text-dim)]">
                        <span>{v.channel}</span>
                        <span>{v.difficulty}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </div>
  )
}
