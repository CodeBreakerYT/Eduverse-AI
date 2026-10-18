import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import { useUserStore } from '../store/useUserStore'

const QUICK_PROMPTS = [
  "I don't understand this.",
  'Explain this more simply.',
  'Show me visually.',
  'Give me a real-world example.',
  'Explain the code.',
]

export default function AITutor() {
  const profile = useUserStore((s) => s.profile)
  const chatHistory = useUserStore((s) => s.chatHistory)
  const pushChat = useUserStore((s) => s.pushChat)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [chatHistory, loading])

  const greeted = useRef(false)
  useEffect(() => {
    if (chatHistory.length === 0 && !greeted.current) {
      greeted.current = true
      pushChat('assistant', `Hi ${profile.name || 'there'}! I'm your AI Tutor, adapted to your ${profile.learningPreferences.join(', ') || 'visual'} learning style. Ask me anything — about a concept, a piece of code, or a topic you're stuck on.`)
    }
  }, [])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    pushChat('user', text)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, profile, history: chatHistory.slice(-8) }),
      })
      const data = await res.json()
      pushChat('assistant', data.reply || 'Sorry, I had trouble responding — try again.')
    } catch {
      pushChat('assistant', 'I could not reach the tutor service. Make sure the backend server is running on port 8787.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col px-6 pb-6 pt-8 md:px-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500">
          <Sparkles size={18} className="text-black" />
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold">AI Tutor</h1>
          <p className="text-xs text-[var(--ev-text-dim)]">Powered by Groq · Adapted to {profile.name || 'your'} profile</p>
        </div>
      </div>

      <div ref={scrollRef} className="glass mb-4 flex-1 space-y-4 overflow-y-auto rounded-2xl p-5">
        {chatHistory.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                m.role === 'user'
                  ? 'bg-gradient-to-br from-violet-500/40 to-fuchsia-500/30 text-white'
                  : 'border border-white/10 bg-white/5 text-[var(--ev-text)]'
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-violet-300"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[var(--ev-text-dim)] transition hover:border-white/25 hover:text-white"
          >
            {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI tutor anything…"
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-violet-400/60"
        />
        <button type="submit" className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-black">
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
