import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

export default function BubbleWindow({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-[5%] md:p-[7%]"
    >
      <div className="pointer-events-auto absolute inset-0 bg-black/35" onClick={() => navigate('/world')} />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="glass pointer-events-auto relative flex h-full max-h-[80vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl shadow-[0_0_80px_rgba(139,124,255,0.2)]"
      >
        <button
          onClick={() => navigate('/world')}
          className="absolute right-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/70 backdrop-blur transition hover:bg-black/60 hover:text-white"
          aria-label="Close and return to My Learning World"
        >
          <X size={16} />
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  )
}
