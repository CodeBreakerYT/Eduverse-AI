import { useUserStore } from '../store/useUserStore'
import { LEARNING_PREFERENCES } from '../data/subjects'

export default function Profile() {
  const profile = useUserStore((s) => s.profile)
  const gamification = useUserStore((s) => s.gamification)
  const topics = useUserStore((s) => s.topics)

  // Strong/weak subjects are derived from real, earned topic mastery —
  // not guessed at onboarding — so a brand-new account correctly shows
  // "not enough data yet" instead of fabricated results.
  const strong = [...new Set(topics.filter((t) => t.mastery >= 75).map((t) => t.subject))]
  const weak = [...new Set(topics.filter((t) => t.mastery > 0 && t.mastery < 40).map((t) => t.subject))]

  return (
    <div className="px-6 py-8 pb-28 md:px-10 lg:pb-10">
      <h1 className="font-display mb-2 text-3xl font-semibold">Profile</h1>
      <p className="mb-8 text-[var(--ev-text-dim)]">Your personalized learning profile, generated during onboarding.</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 text-center lg:col-span-1">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 text-3xl font-bold text-black">
            {(profile.name || '?').charAt(0).toUpperCase()}
          </div>
          <h2 className="font-display text-xl font-semibold">{profile.name || 'Explorer'}</h2>
          <p className="text-sm text-[var(--ev-text-dim)]">
            {profile.level === 'school' ? profile.grade : `${profile.course} · ${profile.year}`}
          </p>
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <div>
              <div className="font-display text-lg font-semibold text-violet-300">{gamification.level}</div>
              <div className="text-[var(--ev-text-dim)]">Level</div>
            </div>
            <div>
              <div className="font-display text-lg font-semibold text-cyan-300">{gamification.xp}</div>
              <div className="text-[var(--ev-text-dim)]">XP</div>
            </div>
            <div>
              <div className="font-display text-lg font-semibold text-amber-300">{gamification.streak}</div>
              <div className="text-[var(--ev-text-dim)]">Streak</div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-[var(--ev-text-dim)]">Learning Profile</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow label="Education" value={profile.level === 'school' ? 'School' : 'College'} />
            <InfoRow label={profile.level === 'school' ? 'Grade' : 'Course'} value={profile.level === 'school' ? profile.grade || '—' : profile.course || '—'} />
            {profile.level === 'college' && <InfoRow label="Year" value={profile.year || '—'} />}
            <InfoRow
              label="Learning Preference"
              value={profile.learningPreferences.map((id) => LEARNING_PREFERENCES.find((p) => p.id === id)?.label).join(', ') || '—'}
            />
            <InfoRow label="Strong Subjects" value={strong.join(', ') || 'Not enough data yet'} />
            <InfoRow label="Areas to Improve" value={weak.join(', ') || 'Not enough data yet'} />
          </div>

          <h3 className="mb-3 mt-6 font-display text-sm font-semibold uppercase tracking-wide text-[var(--ev-text-dim)]">Subjects</h3>
          <div className="flex flex-wrap gap-2">
            {profile.subjects.map((s) => (
              <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wide text-[var(--ev-text-dim)]">{label}</div>
      <div className="mt-0.5 text-sm">{value}</div>
    </div>
  )
}
