import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import WorldHeader from '../../components/layout/WorldHeader'
import { useUserStore } from '../../store/useUserStore'

type Algo = 'bubble' | 'insertion' | 'selection' | 'merge' | 'quick' | 'heap'

const ALGOS: { id: Algo; label: string; complexity: string }[] = [
  { id: 'bubble', label: 'Bubble Sort', complexity: 'O(n²)' },
  { id: 'insertion', label: 'Insertion Sort', complexity: 'O(n²)' },
  { id: 'selection', label: 'Selection Sort', complexity: 'O(n²)' },
  { id: 'merge', label: 'Merge Sort', complexity: 'O(n log n)' },
  { id: 'quick', label: 'Quick Sort', complexity: 'O(n log n)' },
  { id: 'heap', label: 'Heap Sort', complexity: 'O(n log n)' },
]

interface Step {
  array: number[]
  compare: number[]
  swap: number[]
  sorted: number[]
}

function genSteps(algo: Algo, input: number[]): Step[] {
  const arr = [...input]
  const steps: Step[] = []
  const n = arr.length
  const snap = (compare: number[] = [], swap: number[] = [], sorted: number[] = []) =>
    steps.push({ array: [...arr], compare, swap, sorted })

  if (algo === 'bubble') {
    const sorted: number[] = []
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        snap([j, j + 1], [], sorted)
        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          snap([], [j, j + 1], sorted)
        }
      }
      sorted.unshift(n - i - 1)
    }
    snap([], [], Array.from({ length: n }, (_, i) => i))
  } else if (algo === 'insertion') {
    const sorted = [0]
    for (let i = 1; i < n; i++) {
      let j = i
      while (j > 0 && arr[j - 1] > arr[j]) {
        snap([j - 1, j], [], sorted)
        ;[arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
        snap([], [j - 1, j], sorted)
        j--
      }
      sorted.push(i)
    }
    snap([], [], Array.from({ length: n }, (_, i) => i))
  } else if (algo === 'selection') {
    const sorted: number[] = []
    for (let i = 0; i < n; i++) {
      let min = i
      for (let j = i + 1; j < n; j++) {
        snap([min, j], [], sorted)
        if (arr[j] < arr[min]) min = j
      }
      if (min !== i) {
        ;[arr[i], arr[min]] = [arr[min], arr[i]]
        snap([], [i, min], sorted)
      }
      sorted.push(i)
    }
    snap([], [], Array.from({ length: n }, (_, i) => i))
  } else if (algo === 'merge') {
    function mergeSort(lo: number, hi: number) {
      if (hi - lo <= 1) return
      const mid = Math.floor((lo + hi) / 2)
      mergeSort(lo, mid)
      mergeSort(mid, hi)
      const merged: number[] = []
      let i = lo,
        j = mid
      while (i < mid && j < hi) {
        snap([i, j])
        if (arr[i] <= arr[j]) merged.push(arr[i++])
        else merged.push(arr[j++])
      }
      while (i < mid) merged.push(arr[i++])
      while (j < hi) merged.push(arr[j++])
      for (let k = 0; k < merged.length; k++) arr[lo + k] = merged[k]
      snap([], Array.from({ length: hi - lo }, (_, k) => lo + k))
    }
    mergeSort(0, n)
    snap([], [], Array.from({ length: n }, (_, i) => i))
  } else if (algo === 'quick') {
    function partition(lo: number, hi: number) {
      const pivot = arr[hi]
      let i = lo
      for (let j = lo; j < hi; j++) {
        snap([j, hi])
        if (arr[j] < pivot) {
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          snap([], [i, j])
          i++
        }
      }
      ;[arr[i], arr[hi]] = [arr[hi], arr[i]]
      snap([], [i, hi])
      return i
    }
    function quickSort(lo: number, hi: number) {
      if (lo >= hi) return
      const p = partition(lo, hi)
      quickSort(lo, p - 1)
      quickSort(p + 1, hi)
    }
    quickSort(0, n - 1)
    snap([], [], Array.from({ length: n }, (_, i) => i))
  } else if (algo === 'heap') {
    function heapify(size: number, root: number) {
      let largest = root
      const l = 2 * root + 1
      const r = 2 * root + 2
      if (l < size) {
        snap([largest, l])
        if (arr[l] > arr[largest]) largest = l
      }
      if (r < size) {
        snap([largest, r])
        if (arr[r] > arr[largest]) largest = r
      }
      if (largest !== root) {
        ;[arr[root], arr[largest]] = [arr[largest], arr[root]]
        snap([], [root, largest])
        heapify(size, largest)
      }
    }
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i)
    const sorted: number[] = []
    for (let i = n - 1; i > 0; i--) {
      ;[arr[0], arr[i]] = [arr[i], arr[0]]
      sorted.unshift(i)
      snap([], [0, i], sorted)
      heapify(i, 0)
    }
    snap([], [], Array.from({ length: n }, (_, i) => i))
  }
  return steps
}

function randomArray(n = 9) {
  return Array.from({ length: n }, () => 8 + Math.floor(Math.random() * 90))
}

export default function SortingArena() {
  const [algo, setAlgo] = useState<Algo>('bubble')
  const [input, setInput] = useState<number[]>(randomArray())
  const [steps, setSteps] = useState<Step[]>(() => genSteps('bubble', input))
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(400)
  const addXP = useUserStore((s) => s.addXP)
  const updateTopicMastery = useUserStore((s) => s.updateTopicMastery)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const rebuild = (newAlgo: Algo, arr: number[]) => {
    setSteps(genSteps(newAlgo, arr))
    setIdx(0)
    setPlaying(false)
  }

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setIdx((i) => {
          if (i >= steps.length - 1) {
            setPlaying(false)
            addXP(5)
            updateTopicMastery('sorting', 'Computer Science', 'Sorting Algorithms', 4)
            return i
          }
          return i + 1
        })
      }, speed)
    }
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [playing, speed, steps.length])

  const step = steps[idx]
  const maxVal = Math.max(...input)
  const operations = idx

  return (
    <div className="pb-8">
      <WorldHeader icon="⚡" title="Sorting Arena" tagline="Numbers as physical 3D blocks — watch algorithms move them" color="#ffb454" />

      <div className="grid grid-cols-1 gap-6 px-6 md:px-10 lg:grid-cols-4">
        <div className="glass rounded-2xl p-6 lg:col-span-3">
          <div className="flex h-72 items-end justify-center gap-2">
            {step.array.map((val, i) => {
              const isCompare = step.compare.includes(i)
              const isSwap = step.swap.includes(i)
              const isSorted = step.sorted.includes(i)
              let bg = 'linear-gradient(180deg, #2a2c3a, #1a1c26)'
              if (isSorted) bg = 'linear-gradient(180deg, #4fe3d0, #2c9d8f)'
              else if (isSwap) bg = 'linear-gradient(180deg, #ff6ec7, #b03d8d)'
              else if (isCompare) bg = 'linear-gradient(180deg, #ffb454, #b8823a)'
              return (
                <motion.div
                  key={i}
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="flex w-9 flex-col items-center justify-end rounded-md text-[11px] font-mono font-semibold text-black/80 shadow-lg"
                  style={{ height: `${(val / maxVal) * 100}%`, background: bg, color: isSorted || isSwap ? '#08060d' : '#e7e9f2' }}
                >
                  <span className="mb-1">{val}</span>
                </motion.div>
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-xs font-semibold text-black"
            >
              {playing ? 'Pause' : idx >= steps.length - 1 ? 'Replay' : 'Play'}
            </button>
            <button
              onClick={() => { if (idx >= steps.length - 1) rebuild(algo, input); setIdx((i) => Math.min(i + 1, steps.length - 1)) }}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs"
            >
              Step →
            </button>
            <button
              onClick={() => { const a = randomArray(); setInput(a); rebuild(algo, a) }}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs"
            >
              Shuffle
            </button>
            <div className="ml-auto flex items-center gap-2 text-xs text-[var(--ev-text-dim)]">
              Speed
              <input type="range" min={100} max={900} step={100} value={1000 - speed} onChange={(e) => setSpeed(1000 - parseInt(e.target.value))} className="accent-amber-400" />
            </div>
          </div>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full bg-gradient-to-r from-amber-400 to-orange-500" animate={{ width: `${(idx / (steps.length - 1)) * 100}%` }} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-display text-sm font-semibold">Algorithm</h3>
            <div className="space-y-2">
              {ALGOS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { setAlgo(a.id); rebuild(a.id, input) }}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs transition ${
                    algo === a.id ? 'border-amber-400/60 bg-amber-500/10 text-amber-100' : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span>{a.label}</span>
                  <span className="font-mono text-[10px] text-[var(--ev-text-dim)]">{a.complexity}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-2 font-mono text-xs">
            <Row label="Comparing" value={step.compare.length ? step.compare.map((i) => step.array[i]).join(', ') : '—'} />
            <Row label="Swapping" value={step.swap.length ? step.swap.map((i) => step.array[i]).join(', ') : '—'} />
            <Row label="Sorted" value={`${step.sorted.length}/${step.array.length}`} />
            <Row label="Operations" value={`${operations}`} />
            <Row label="Complexity" value={ALGOS.find((a) => a.id === algo)!.complexity} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--ev-text-dim)]">{label}</span>
      <span>{value}</span>
    </div>
  )
}
