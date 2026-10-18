import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import type { RecommendedVideo } from '../../data/subjects'

export default function VideoCarousel({ videos, onPlay }: { videos: RecommendedVideo[]; onPlay: (video: RecommendedVideo) => void }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {videos.map((v, i) => (
        <motion.button
          key={v.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -6 }}
          onClick={() => onPlay(v)}
          className="glass w-72 shrink-0 cursor-pointer overflow-hidden rounded-2xl text-left"
        >
          <div className="group relative h-36 overflow-hidden bg-black">
            <img
              src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
              alt={v.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur transition group-hover:scale-110 group-hover:bg-white/30">
                <Play size={20} className="ml-0.5 text-white" fill="white" />
              </div>
            </div>
            <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] text-white">{v.duration}</span>
          </div>
          <div className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--ev-text-dim)]">{v.subject}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-[var(--ev-text-dim)]">{v.difficulty}</span>
            </div>
            <h4 className="mb-1 font-display text-sm font-semibold leading-snug">{v.title}</h4>
            <p className="mb-1.5 text-[11px] text-[var(--ev-text-dim)]">{v.channel}</p>
            <p className="text-xs text-[var(--ev-text-dim)]">{v.reason}</p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
