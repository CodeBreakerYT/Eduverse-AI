import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useUserStore } from '../../store/useUserStore'
import { SUBJECT_WORLDS, planetsForSubjects, type SubjectDef } from '../../data/subjects'
import { SubjectContext } from '../../context/SubjectContext'
import WorldHubScene from '../three/WorldHubScene'
import FloatingNavIcons from '../ui/FloatingNavIcons'
import BubbleWindow from '../ui/BubbleWindow'

function matchSubjectFromPath(pathname: string): SubjectDef | null {
  const direct = SUBJECT_WORLDS.find((w) => w.route === pathname)
  if (direct) return direct
  return SUBJECT_WORLDS.find((w) => pathname.startsWith(`${w.route}/`)) ?? null
}

interface NearInfo {
  id: string
  name: string
  color: string
  icon: string
}

export default function WorldShell() {
  const profile = useUserStore((s) => s.profile)
  const navigate = useNavigate()
  const location = useLocation()
  const worlds = planetsForSubjects(profile.subjects, profile.level)
  const [showIntroCard, setShowIntroCard] = useState(true)
  const [nearSubject, setNearSubject] = useState<NearInfo | null>(null)
  const [activeSubject, setActiveSubject] = useState<SubjectDef | null>(null)

  const atHub = location.pathname === '/world'

  useEffect(() => {
    const timer = setTimeout(() => setShowIntroCard(false), 8000)
    return () => clearTimeout(timer)
  }, [])

  // The "active subject" is sticky: flying into a planet sets it, and it
  // stays set as you hop between Explore/Practice/etc via the floating
  // icons (so those pages can filter to it) — it only clears when you
  // return to the free-roam hub or explicitly clear it.
  useEffect(() => {
    if (atHub) {
      setActiveSubject(null)
      return
    }
    const matched = matchSubjectFromPath(location.pathname)
    if (matched) setActiveSubject(matched)
  }, [location.pathname, atHub])

  const subjectContextValue = useMemo(
    () => ({ activeSubject, clearActiveSubject: () => setActiveSubject(null) }),
    [activeSubject],
  )

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <Canvas camera={{ fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <Suspense fallback={null}>
          <WorldHubScene
            worlds={worlds}
            profileName={profile.name}
            onEnter={(route) => navigate(route)}
            onNearChange={setNearSubject}
            frozen={!atHub}
          />
        </Suspense>
      </Canvas>

      <FloatingNavIcons active={!atHub} />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-6 md:p-8">
        <div className="glass pointer-events-auto rounded-2xl px-5 py-3">
          <h1 className="font-display text-lg font-semibold md:text-xl">My Learning World</h1>
          <p className="text-xs text-[var(--ev-text-dim)]">
            {atHub
              ? `${profile.name || 'Explorer'}'s universe · fly into a planet to enter it`
              : `Exploring ${activeSubject?.name ?? 'EduVerse'} · icons still work — jump anywhere`}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {nearSubject && atHub && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="pointer-events-none absolute bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black md:bottom-28"
          >
            Entering {nearSubject.name}…
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntroCard && atHub && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="glass pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full px-5 py-2.5 text-xs text-[var(--ev-text-dim)] md:bottom-10"
          >
            <span className="font-mono text-white">W A S D</span> to fly · <span className="font-mono text-white">SPACE</span> to boost · fly into a planet to enter
          </motion.div>
        )}
      </AnimatePresence>

      <SubjectContext.Provider value={subjectContextValue}>
        <AnimatePresence mode="wait">
          {!atHub && (
            <BubbleWindow key={location.pathname}>
              <Outlet />
            </BubbleWindow>
          )}
        </AnimatePresence>
      </SubjectContext.Provider>
    </div>
  )
}
