import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WorldHeader from '../../components/layout/WorldHeader'

const ERAS = [
  {
    id: 'ancient',
    name: 'Ancient Civilizations',
    range: '3000 BCE – 500 CE',
    color: '#ffb454',
    events: ['Rise of Mesopotamia', 'Egyptian pyramids built', 'Founding of Rome', 'Fall of the Western Roman Empire'],
  },
  {
    id: 'medieval',
    name: 'Medieval History',
    range: '500 – 1500 CE',
    color: '#8b7cff',
    events: ['Byzantine Empire flourishes', 'Islamic Golden Age', 'Crusades begin', 'The Black Death'],
  },
  {
    id: 'scientific',
    name: 'Scientific Discoveries',
    range: '1500 – 1900 CE',
    color: '#4fe3d0',
    events: ['Copernican heliocentrism', 'Newton\'s laws of motion', 'Darwin\'s theory of evolution', 'Discovery of electricity'],
  },
  {
    id: 'wars',
    name: 'World Wars',
    range: '1914 – 1945 CE',
    color: '#ff6ec7',
    events: ['World War I begins', 'The Treaty of Versailles', 'World War II begins', 'United Nations founded'],
  },
]

export default function HistoryWorld() {
  const [activeEra, setActiveEra] = useState(ERAS[0].id)
  const era = ERAS.find((e) => e.id === activeEra)!

  return (
    <div className="pb-8">
      <WorldHeader icon="🏛" title="History Portal" tagline="Travel through time across humanity's defining eras" color="#ffb454" worldId="history" />

      <div className="px-6 md:px-10">
        <div className="relative mb-10 h-24">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/10" />
          <div className="relative flex h-full items-center justify-between">
            {ERAS.map((e) => (
              <button key={e.id} onClick={() => setActiveEra(e.id)} className="group flex flex-col items-center gap-2">
                <motion.div
                  className="h-4 w-4 rounded-full"
                  style={{ background: e.color, boxShadow: activeEra === e.id ? `0 0 20px ${e.color}` : 'none' }}
                  animate={{ scale: activeEra === e.id ? 1.4 : 1 }}
                />
                <span className={`text-[11px] transition ${activeEra === e.id ? 'text-white' : 'text-[var(--ev-text-dim)] group-hover:text-white'}`}>
                  {e.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={era.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-2xl p-6 md:p-8"
          >
            <div className="mb-1 text-xs font-medium uppercase tracking-wide" style={{ color: era.color }}>{era.range}</div>
            <h2 className="font-display mb-6 text-2xl font-semibold">{era.name}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {era.events.map((ev, i) => (
                <motion.div
                  key={ev}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-4"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold" style={{ background: `${era.color}25`, color: era.color }}>
                    {i + 1}
                  </div>
                  <p className="text-sm">{ev}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
