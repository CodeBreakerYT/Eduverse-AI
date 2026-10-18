import { X } from 'lucide-react'
import type { SubjectDef } from '../../data/subjects'

export default function SubjectFilterBanner({
  subject,
  onClear,
  label = 'Showing',
}: {
  subject: SubjectDef
  onClear: () => void
  label?: string
}) {
  return (
    <div
      className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm"
      style={{ borderColor: `${subject.color}40`, background: `${subject.color}12` }}
    >
      <span className="text-lg">{subject.icon}</span>
      <span>
        {label} <span className="font-semibold">{subject.name}</span> content only
      </span>
      <button
        onClick={onClear}
        className="ml-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs text-[var(--ev-text-dim)] transition hover:text-white"
      >
        <X size={12} /> Show all
      </button>
    </div>
  )
}
