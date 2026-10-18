import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useUserStore } from '../store/useUserStore'
import SubjectFilterBanner from '../components/ui/SubjectFilterBanner'
import { useActiveSubject } from '../context/SubjectContext'
import { QUESTION_BANK as BANK } from '../data/questions'

export default function Practice() {
  const [i, setI] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const addXP = useUserStore((s) => s.addXP)
  const updateTopicMastery = useUserStore((s) => s.updateTopicMastery)
  const { activeSubject, clearActiveSubject } = useActiveSubject()

  const bank = useMemo(
    () => (activeSubject ? BANK.filter((b) => b.subject === activeSubject.name) : BANK),
    [activeSubject],
  )
  const q = bank.length > 0 ? bank[i % bank.length] : null

  const choose = (idx: number) => {
    if (!q || selected !== null) return
    setSelected(idx)
    const correct = idx === q.answer
    if (correct) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
      addXP(10)
      updateTopicMastery(q.topic.toLowerCase().replace(/\s/g, '-'), q.subject, q.topic, 5)
    } else {
      setStreak(0)
      updateTopicMastery(q.topic.toLowerCase().replace(/\s/g, '-'), q.subject, q.topic, -3)
    }
  }

  const next = () => {
    setSelected(null)
    setI((v) => v + 1)
  }

  return (
    <div className="px-6 py-8 pb-28 md:px-10 lg:pb-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display mb-2 text-3xl font-semibold">Practice</h1>
          <p className="text-[var(--ev-text-dim)]">Adaptive challenges — difficulty adjusts to your performance.</p>
        </div>
        <div className="flex gap-3">
          <div className="glass rounded-xl px-4 py-2 text-center">
            <div className="font-display text-lg font-semibold text-cyan-300">{score}</div>
            <div className="text-[10px] text-[var(--ev-text-dim)]">Correct</div>
          </div>
          <div className="glass rounded-xl px-4 py-2 text-center">
            <div className="font-display text-lg font-semibold text-amber-300">{streak}</div>
            <div className="text-[10px] text-[var(--ev-text-dim)]">Streak</div>
          </div>
        </div>
      </div>

      {activeSubject && <SubjectFilterBanner subject={activeSubject} onClear={clearActiveSubject} />}

      {!q ? (
        <div className="glass mx-auto max-w-2xl rounded-2xl p-8 text-center text-sm text-[var(--ev-text-dim)]">
          No {activeSubject?.name} practice questions yet — check back soon, or explore another subject.
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id + i}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="glass mx-auto max-w-2xl rounded-2xl p-6 md:p-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[11px] text-violet-300">{q.topic}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] ${
                  q.difficulty === 'Easy' ? 'bg-emerald-500/15 text-emerald-300' : q.difficulty === 'Medium' ? 'bg-amber-500/15 text-amber-300' : 'bg-rose-500/15 text-rose-300'
                }`}
              >
                {q.difficulty}
              </span>
            </div>
            <h2 className="font-display mb-6 text-xl font-semibold leading-snug">{q.q}</h2>
            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const isCorrect = idx === q.answer
                const isChosen = idx === selected
                let cls = 'border-white/10 bg-white/5 hover:border-white/25'
                if (selected !== null) {
                  if (isCorrect) cls = 'border-emerald-400/60 bg-emerald-500/10'
                  else if (isChosen) cls = 'border-rose-400/60 bg-rose-500/10'
                }
                return (
                  <button key={idx} onClick={() => choose(idx)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}>
                    {opt}
                    {selected !== null && isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                    {selected !== null && isChosen && !isCorrect && <XCircle size={16} className="text-rose-400" />}
                  </button>
                )
              })}
            </div>

            {selected !== null && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 overflow-hidden">
                <p className="rounded-xl bg-black/20 p-4 text-xs leading-relaxed text-[var(--ev-text-dim)]">{q.explain}</p>
                <button onClick={next} className="mt-4 rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-xs font-semibold text-black">
                  Next Challenge →
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
