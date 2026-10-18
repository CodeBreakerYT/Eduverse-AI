import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AmbientField from '../components/three/AmbientField'
import { useUserStore } from '../store/useUserStore'

const PILLARS = [
  { icon: '🧠', title: 'AI-Powered', desc: 'Gemini-driven tutoring that adapts to how you learn, not the other way around.' },
  { icon: '🌌', title: '3D Learning Worlds', desc: 'Walk through interactive dimensions built for Math, Physics, Chemistry, CS & more.' },
  { icon: '📈', title: 'ML Personalization', desc: 'A recommendation engine that studies your habits and evolves with you.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const onboardingComplete = useUserStore((s) => s.profile.onboardingComplete)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--ev-bg)] text-[var(--ev-text)]">
      <AmbientField />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,124,255,0.12),_transparent_65%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-2 text-sm text-[var(--ev-text-dim)]">
          <span className="animate-pulse-glow text-cyan-300">●</span> Personalized 3D learning, powered by AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display mb-6 text-5xl font-semibold leading-tight md:text-7xl"
        >
          Welcome to <span className="ev-gradient-text glow-text">EduVerse AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 max-w-2xl text-lg text-[var(--ev-text-dim)]"
        >
          Education should adapt to the student, not force every student to learn the same way. Step into your own
          personalized universe — where every equation floats, every atom reacts, and every concept becomes
          something you can touch.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate(onboardingComplete ? '/dashboard' : '/onboarding')}
            className="rounded-xl bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-8 py-4 font-semibold text-black shadow-[0_0_40px_rgba(139,124,255,0.4)] transition hover:scale-[1.02]"
          >
            {onboardingComplete ? 'Enter Your World →' : 'Begin Your Journey →'}
          </button>
          {onboardingComplete && (
            <button
              onClick={() => navigate('/onboarding')}
              className="rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-semibold transition hover:bg-white/10"
            >
              Redo Onboarding
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-3"
        >
          {PILLARS.map((p) => (
            <div key={p.title} className="glass animate-float rounded-2xl p-6 text-left" style={{ animationDelay: `${Math.random()}s` }}>
              <div className="mb-3 text-3xl">{p.icon}</div>
              <h3 className="font-display mb-1 text-base font-semibold">{p.title}</h3>
              <p className="text-sm text-[var(--ev-text-dim)]">{p.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
