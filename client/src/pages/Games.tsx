import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SubjectFilterBanner from '../components/ui/SubjectFilterBanner'
import { useActiveSubject } from '../context/SubjectContext'

const GAMES = [
  {
    id: 'quiz-blitz',
    name: 'Quiz Blitz',
    icon: '⚡',
    color: '#ff6ec7',
    tagline: 'Every Subject',
    desc: '60-second rapid-fire quiz across Math, Physics, Chemistry, Biology, CS, History & Geography. Chain streaks for bonus points.',
    route: '/games/quiz-blitz',
  },
  {
    id: 'sort-rush',
    name: 'Sort Rush',
    icon: '⚡',
    color: '#ffb454',
    tagline: 'Puzzle',
    desc: 'Swap tiles to sort the row in as few moves as possible. Beat the optimal move count for 3 stars.',
    route: '/games/sort-rush',
  },
  {
    id: 'math-runner',
    name: 'Math Runner',
    icon: '🏃',
    color: '#4fe3d0',
    tagline: 'Arcade Runner',
    desc: "Switch lanes to catch the correct answer before it reaches you. Speed ramps up — how long can you survive?",
    route: '/games/math-runner',
  },
  {
    id: 'graph-quest',
    name: 'Graph Quest',
    icon: '🕸',
    color: '#8b7cff',
    tagline: 'Puzzle',
    desc: 'Hop across a graph of nodes to reach the goal in the fewest hops — race the shortest path.',
    route: '/games/graph-quest',
  },
]

export default function Games() {
  const navigate = useNavigate()
  const { activeSubject, clearActiveSubject } = useActiveSubject()
  return (
    <div className="px-6 py-8 pb-28 md:px-10 lg:pb-10">
      <h1 className="font-display mb-2 text-3xl font-semibold">Games</h1>
      <p className="mb-8 max-w-2xl text-[var(--ev-text-dim)]">
        Learning that plays like a game, not a lecture. Earn XP, beat your high score, and level up real skills.
      </p>

      {activeSubject && <SubjectFilterBanner subject={activeSubject} onClear={clearActiveSubject} label="Quiz Blitz will pull from" />}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((g, i) => (
          <motion.button
            key={g.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={g.route ? { y: -6, boxShadow: `0 0 40px ${g.color}30` } : {}}
            onClick={() => g.route && navigate(g.route)}
            disabled={!g.route}
            className={`glass relative overflow-hidden rounded-2xl p-6 text-left ${!g.route ? 'cursor-not-allowed opacity-50' : ''}`}
            style={{ boxShadow: `inset 0 0 0 1px ${g.color}25` }}
          >
            <div
              className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl"
              style={{ background: g.color, opacity: 0.18 }}
            />
            <div className="relative mb-4 text-4xl">{g.icon}</div>
            <div className="relative mb-1 flex items-center gap-2">
              <h3 className="font-display text-lg font-semibold">{g.name}</h3>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: `${g.color}22`, color: g.color }}>
                {g.tagline}
              </span>
            </div>
            <p className="relative text-sm text-[var(--ev-text-dim)]">{g.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
