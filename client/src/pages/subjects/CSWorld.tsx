import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import WorldHeader from '../../components/layout/WorldHeader'

const ZONES = [
  { id: 'library', name: 'Data Structure Library', icon: '📚', desc: 'Stacks, queues, linked lists & trees', route: '/world/cs/sorting', color: '#5b9dff' },
  { id: 'sorting', name: 'Sorting Arena', icon: '⚡', desc: 'Watch algorithms sort physical blocks', route: '/world/cs/sorting', color: '#ffb454' },
  { id: 'tree', name: 'Tree Garden', icon: '🌳', desc: 'Binary trees, BSTs & traversals', route: '/world/cs/graph', color: '#66ffa3' },
  { id: 'graph', name: 'Graph Laboratory', icon: '🕸', desc: 'BFS, DFS, Dijkstra & more', route: '/world/cs/graph', color: '#8b7cff' },
  { id: 'dp', name: 'Dynamic Programming Chamber', icon: '🧩', desc: 'Memoization & tabulation puzzles', route: '/world/cs/graph', color: '#ff6ec7' },
  { id: 'security', name: 'Cybersecurity Zone', icon: '🔐', desc: 'Encryption & network defense', route: '/world/cs/sorting', color: '#ff4d6d' },
  { id: 'database', name: 'Database Center', icon: '🗄', desc: 'SQL, indexing & normalization', route: '/world/cs/sorting', color: '#4fe3d0' },
  { id: 'workshop', name: 'Programming Workshop', icon: '💻', desc: 'Code + live 3D visualization', route: '/world/cs/graph', color: '#c084fc' },
]

export default function CSWorld() {
  const navigate = useNavigate()
  return (
    <div className="pb-8">
      <WorldHeader icon="💻" title="Computer Science World" tagline="A futuristic campus of interactive CS environments" color="#8b7cff" worldId="cs" />

      <div className="grid grid-cols-1 gap-4 px-6 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
        {ZONES.map((z, i) => (
          <motion.button
            key={z.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6, boxShadow: `0 0 40px ${z.color}30` }}
            onClick={() => navigate(z.route)}
            className="glass flex flex-col items-start rounded-2xl p-5 text-left"
            style={{ boxShadow: `inset 0 0 0 1px ${z.color}20` }}
          >
            <div className="mb-3 text-3xl">{z.icon}</div>
            <div className="font-display text-sm font-semibold">{z.name}</div>
            <div className="mt-1 text-[11px] text-[var(--ev-text-dim)]">{z.desc}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
