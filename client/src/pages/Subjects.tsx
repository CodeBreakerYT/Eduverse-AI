import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../store/useUserStore'
import { SUBJECT_WORLDS } from '../data/subjects'

export default function Subjects() {
  const profile = useUserStore((s) => s.profile)
  const navigate = useNavigate()

  return (
    <div className="px-6 py-8 pb-28 md:px-10 lg:pb-10">
      <h1 className="font-display mb-2 text-3xl font-semibold">Subjects</h1>
      <p className="mb-8 text-[var(--ev-text-dim)]">Subjects you selected during onboarding, plus discoverable worlds.</p>

      <div className="mb-10">
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--ev-text-dim)]">Your Subjects</h2>
        <div className="flex flex-wrap gap-2">
          {profile.subjects.map((s) => (
            <span key={s} className="rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-200">
              {s}
            </span>
          ))}
          {profile.subjects.length === 0 && <span className="text-sm text-[var(--ev-text-dim)]">No subjects selected yet.</span>}
        </div>
      </div>

      <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--ev-text-dim)]">All Worlds</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {SUBJECT_WORLDS.map((w, i) => (
          <motion.button
            key={w.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(w.route)}
            whileHover={{ y: -4 }}
            className="glass flex flex-col items-start rounded-2xl p-5 text-left"
          >
            <div className="mb-2 text-2xl">{w.icon}</div>
            <div className="font-display text-sm font-semibold">{w.name}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
