import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Home, BookOpen, Compass, Gamepad2, Dumbbell, MessagesSquare, Sparkles, LineChart, User } from 'lucide-react'

const ICONS = [
  { to: '/dashboard', label: 'Home', icon: Home, pos: 'top-[16%] left-[5%]', duration: 5.2 },
  { to: '/subjects', label: 'Subjects', icon: BookOpen, pos: 'top-[12%] right-[7%]', duration: 6.1 },
  { to: '/explore', label: 'Explore', icon: Compass, pos: 'top-[46%] left-[3%]', duration: 4.6 },
  { to: '/games', label: 'Games', icon: Gamepad2, pos: 'top-[42%] right-[4%]', duration: 5.7 },
  { to: '/practice', label: 'Practice', icon: Dumbbell, pos: 'bottom-[28%] left-[6%]', duration: 6.4 },
  { to: '/tutor', label: 'AI Tutor', icon: MessagesSquare, pos: 'bottom-[32%] right-[6%]', duration: 5.0 },
  { to: '/recommendations', label: 'For You', icon: Sparkles, pos: 'bottom-[12%] left-[13%]', duration: 5.8 },
  { to: '/progress', label: 'Progress', icon: LineChart, pos: 'bottom-[10%] right-[15%]', duration: 4.9 },
  { to: '/profile', label: 'Profile', icon: User, pos: 'top-[68%] right-[2%]', duration: 6.7 },
]

// `active` flips true whenever a subject/bubble is open. Keying the icon
// row on it forces framer to replay each icon's initial->animate pop-in,
// so the nav visibly "announces itself" the moment you enter a planet.
export default function FloatingNavIcons({ active = false }: { active?: boolean }) {
  const navigate = useNavigate()
  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {ICONS.map((item, i) => (
        <motion.button
          key={`${item.to}-${active}`}
          onClick={() => navigate(item.to)}
          className={`group pointer-events-auto absolute flex flex-col items-center gap-1.5 ${item.pos}`}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: 0.06 * i, duration: 0.4 },
            scale: { delay: 0.06 * i, type: 'spring', stiffness: 320, damping: 18 },
            y: { duration: item.duration, repeat: Infinity, ease: 'easeInOut', delay: 0.5 + i * 0.3 },
          }}
          whileHover={{ scale: 1.12 }}
        >
          <div
            className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full text-white/90 backdrop-blur-xl transition-all group-hover:text-white ${
              active ? 'ring-2 ring-white/25' : ''
            }`}
            style={{
              background: 'linear-gradient(150deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05) 45%, rgba(139,124,255,0.12))',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 0 22px rgba(139,124,255,0.35), inset 0 1px 1px rgba(255,255,255,0.4)',
            }}
          >
            <div
              className="pointer-events-none absolute -left-2 -top-3 h-8 w-8 rounded-full opacity-80 blur-md transition-opacity group-hover:opacity-100"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.9), transparent 70%)' }}
            />
            <item.icon size={22} strokeWidth={1.9} className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
          </div>
          <span className="whitespace-nowrap rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur transition-colors group-hover:text-white">
            {item.label}
          </span>
        </motion.button>
      ))}
    </div>
  )
}
