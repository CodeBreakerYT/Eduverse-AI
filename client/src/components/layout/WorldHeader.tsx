import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Dumbbell, Zap } from 'lucide-react'
import { useUserStore } from '../../store/useUserStore'
import { subjectsForWorld } from '../../data/subjects'

export default function WorldHeader({
  icon,
  title,
  tagline,
  color,
  worldId,
}: {
  icon: string
  title: string
  tagline: string
  color: string
  worldId?: string
}) {
  const navigate = useNavigate()
  const profileSubjects = useUserStore((s) => s.profile.subjects)
  const mySubjects = worldId ? subjectsForWorld(worldId, profileSubjects) : []

  return (
    <div className="relative mb-6 px-6 pt-8 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--ev-text-dim)] transition hover:text-white"
          >
            <ArrowLeft size={16} />
          </button>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
            style={{ background: `${color}22`, boxShadow: `0 0 30px ${color}40` }}
          >
            {icon}
          </motion.div>
          <div>
            <h1 className="font-display text-2xl font-semibold md:text-3xl">{title}</h1>
            <p className="text-sm text-[var(--ev-text-dim)]">{tagline}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/practice')}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-[var(--ev-text-dim)] transition hover:border-white/25 hover:text-white"
          >
            <Dumbbell size={14} /> Practice
          </button>
          <button
            onClick={() => navigate('/games/quiz-blitz')}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition hover:brightness-110"
            style={{ borderColor: `${color}55`, background: `${color}18`, color }}
          >
            <Zap size={14} /> Quiz Blitz
          </button>
        </div>
      </div>

      {mySubjects.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--ev-text-dim)]">From your syllabus:</span>
          {mySubjects.map((s) => (
            <span
              key={s}
              className="rounded-full border px-3 py-1 text-xs font-medium"
              style={{ borderColor: `${color}55`, background: `${color}18`, color }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
