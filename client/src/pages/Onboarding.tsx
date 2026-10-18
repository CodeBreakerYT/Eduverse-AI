import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'
import AmbientField from '../components/three/AmbientField'
import {
  collegeSubjectsFor,
  COLLEGE_COURSES,
  COLLEGE_YEARS,
  LEARNING_PREFERENCES,
  SCHOOL_GRADES,
  SCHOOL_SUBJECTS,
} from '../data/subjects'

const fadeStep = {
  initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -24, filter: 'blur(6px)' },
}

export default function Onboarding() {
  const navigate = useNavigate()
  const profile = useUserStore((s) => s.profile)
  const setName = useUserStore((s) => s.setName)
  const setLevel = useUserStore((s) => s.setLevel)
  const setGrade = useUserStore((s) => s.setGrade)
  const setCourseInfo = useUserStore((s) => s.setCourseInfo)
  const toggleSubject = useUserStore((s) => s.toggleSubject)
  const setSubjects = useUserStore((s) => s.setSubjects)
  const togglePreference = useUserStore((s) => s.togglePreference)
  const completeOnboarding = useUserStore((s) => s.completeOnboarding)

  const [step, setStep] = useState(0)
  const [course, setCourse] = useState('Computer Science')
  const [year, setYear] = useState('Year 2')

  const subjectOptions = profile.level === 'school' ? SCHOOL_SUBJECTS : collegeSubjectsFor(course, year)

  // A course/year is a fixed curriculum, not an elective menu — so picking one
  // pre-selects every subject in it by default (the student can still deselect
  // individual ones). This also means the hub ends up with one planet per real
  // subject instead of just whichever single box someone happened to click.
  useEffect(() => {
    if (profile.level === 'college') setSubjects(collegeSubjectsFor(course, year))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleCourseChange = (c: string) => {
    setCourse(c)
    setSubjects(collegeSubjectsFor(c, year))
  }
  const handleYearChange = (y: string) => {
    setYear(y)
    setSubjects(collegeSubjectsFor(course, y))
  }

  const steps = useMemo(() => {
    const base = ['name', 'level']
    if (profile.level === 'school') base.push('grade', 'subjects', 'preferences', 'summary')
    else base.push('course', 'subjects', 'preferences', 'summary')
    return base
  }, [profile.level])

  const current = steps[step]

  const canNext = () => {
    switch (current) {
      case 'name':
        return profile.name.trim().length > 0
      case 'level':
        return !!profile.level
      case 'grade':
        return !!profile.grade
      case 'course':
        return !!course && !!year
      case 'subjects':
        return profile.subjects.length > 0
      case 'preferences':
        return profile.learningPreferences.length > 0
      default:
        return true
    }
  }

  const goNext = () => {
    if (current === 'course') setCourseInfo(course, year)
    if (step < steps.length - 1) setStep(step + 1)
    else finish()
  }
  const goBack = () => step > 0 && setStep(step - 1)

  const finish = () => {
    completeOnboarding()
    navigate('/dashboard')
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--ev-bg)] text-[var(--ev-text)]">
      <AmbientField />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05060a]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16">
        <div className="mb-10 flex items-center gap-2">
          <span className="text-2xl">✦</span>
          <span className="font-display text-lg font-semibold tracking-wide">EduVerse AI</span>
        </div>

        {/* progress */}
        <div className="mb-10 flex w-full max-w-md items-center gap-2">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="glass w-full max-w-xl rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(139,124,255,0.08)]">
          <AnimatePresence mode="wait">
            <motion.div key={current} {...fadeStep} transition={{ duration: 0.4, ease: 'easeOut' }}>
              {current === 'name' && (
                <div>
                  <h1 className="font-display mb-2 text-3xl font-semibold">What should we call you?</h1>
                  <p className="mb-8 text-[var(--ev-text-dim)]">Let's personalize your learning universe.</p>
                  <input
                    autoFocus
                    value={profile.name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && canNext() && goNext()}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-lg outline-none ring-0 transition focus:border-violet-400/60 focus:bg-white/10"
                  />
                </div>
              )}

              {current === 'level' && (
                <div>
                  <h1 className="font-display mb-2 text-3xl font-semibold">Where are you currently studying?</h1>
                  <p className="mb-8 text-[var(--ev-text-dim)]">This shapes your entire learning universe.</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      { id: 'school', label: 'School', icon: '🏫', desc: 'Studying in school' },
                      { id: 'college', label: 'College / University', icon: '🎓', desc: 'Higher education' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setLevel(opt.id as 'school' | 'college')}
                        className={`group rounded-2xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 ${
                          profile.level === opt.id
                            ? 'border-violet-400/70 bg-violet-500/10 shadow-[0_0_30px_rgba(139,124,255,0.25)]'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="mb-3 text-4xl">{opt.icon}</div>
                        <div className="font-display text-xl font-semibold">{opt.label}</div>
                        <div className="mt-1 text-sm text-[var(--ev-text-dim)]">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {current === 'grade' && (
                <div>
                  <h1 className="font-display mb-2 text-3xl font-semibold">What grade are you currently in?</h1>
                  <p className="mb-8 text-[var(--ev-text-dim)]">We'll tune difficulty to match your grade.</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {SCHOOL_GRADES.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGrade(g)}
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                          profile.grade === g
                            ? 'border-cyan-400/70 bg-cyan-500/10 text-cyan-200'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {current === 'course' && (
                <div>
                  <h1 className="font-display mb-2 text-3xl font-semibold">What are you studying?</h1>
                  <p className="mb-6 text-[var(--ev-text-dim)]">Tell us your course and year.</p>
                  <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {COLLEGE_COURSES.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCourseChange(c)}
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                          course === c
                            ? 'border-cyan-400/70 bg-cyan-500/10 text-cyan-200'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <p className="mb-3 text-sm text-[var(--ev-text-dim)]">Current year</p>
                  <div className="flex flex-wrap gap-3">
                    {COLLEGE_YEARS.map((y) => (
                      <button
                        key={y}
                        onClick={() => handleYearChange(y)}
                        className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                          year === y
                            ? 'border-fuchsia-400/70 bg-fuchsia-500/10 text-fuchsia-200'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                  {year === 'Year 1' && (
                    <p className="mt-4 text-xs text-[var(--ev-text-dim)]">
                      Year 1 covers foundational subjects shared across most streams — your course-specific subjects unlock from Year 2 onward.
                    </p>
                  )}
                </div>
              )}

              {current === 'subjects' && (
                <div>
                  <h1 className="font-display mb-2 text-3xl font-semibold">
                    {profile.level === 'school' ? 'What subjects do you want to learn?' : 'Select subjects you want to learn.'}
                  </h1>
                  <p className="mb-8 text-[var(--ev-text-dim)]">Choose as many as you like.</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {subjectOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSubject(s)}
                        className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                          profile.subjects.includes(s)
                            ? 'border-violet-400/70 bg-violet-500/10 text-violet-200'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {current === 'preferences' && (
                <div>
                  <h1 className="font-display mb-2 text-3xl font-semibold">How do you prefer learning?</h1>
                  <p className="mb-8 text-[var(--ev-text-dim)]">Select all that resonate with you.</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {LEARNING_PREFERENCES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => togglePreference(p.id)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                          profile.learningPreferences.includes(p.id)
                            ? 'border-amber-400/70 bg-amber-500/10 text-amber-100'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xl">{p.icon}</span>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {current === 'summary' && (
                <div>
                  <h1 className="font-display mb-2 text-3xl font-semibold">
                    Your learning profile is ready, {profile.name || 'Explorer'}.
                  </h1>
                  <p className="mb-8 text-[var(--ev-text-dim)]">EduVerse AI will use this to build your personalized 3D universe.</p>
                  <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-5 font-mono text-sm">
                    <Row label="Student" value={profile.name || '—'} />
                    <Row label="Education" value={profile.level === 'school' ? 'School' : 'College'} />
                    <Row label={profile.level === 'school' ? 'Grade' : 'Course'} value={profile.level === 'school' ? profile.grade || '—' : `${course} · ${year}`} />
                    <Row label="Subjects" value={profile.subjects.join(', ') || '—'} />
                    <Row
                      label="Learning Preference"
                      value={profile.learningPreferences.map((id) => LEARNING_PREFERENCES.find((p) => p.id === id)?.label).join(', ') || '—'}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="rounded-lg px-4 py-2 text-sm text-[var(--ev-text-dim)] transition hover:text-white disabled:opacity-0"
            >
              ← Back
            </button>
            <button
              onClick={goNext}
              disabled={!canNext()}
              className="rounded-xl bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_0_30px_rgba(139,124,255,0.35)] transition disabled:cursor-not-allowed disabled:opacity-30"
            >
              {current === 'summary' ? 'Enter EduVerse AI →' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[var(--ev-text-dim)]">{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  )
}
