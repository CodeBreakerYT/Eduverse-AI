import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { RecommendedVideo } from '../../data/subjects'

export default function VideoModal({ video, onClose }: { video: RecommendedVideo | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-3xl overflow-hidden rounded-2xl"
          >
            <div className="aspect-video w-full bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex items-start justify-between gap-4 p-5">
              <div>
                <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--ev-text-dim)]">
                  <span>{video.subject}</span>
                  <span>·</span>
                  <span>{video.channel}</span>
                </div>
                <h3 className="font-display text-base font-semibold">{video.title}</h3>
                <p className="mt-1 text-xs text-[var(--ev-text-dim)]">{video.reason}</p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--ev-text-dim)] transition hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
