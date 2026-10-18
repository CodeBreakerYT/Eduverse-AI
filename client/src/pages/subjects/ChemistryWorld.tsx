import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import WorldHeader from '../../components/layout/WorldHeader'
import { useUserStore } from '../../store/useUserStore'

interface Element {
  symbol: string
  name: string
  color: string
  electrons: number
}

const ELEMENTS: Element[] = [
  { symbol: 'H', name: 'Hydrogen', color: '#4fe3d0', electrons: 1 },
  { symbol: 'O', name: 'Oxygen', color: '#ff6ec7', electrons: 6 },
  { symbol: 'C', name: 'Carbon', color: '#8b7cff', electrons: 4 },
  { symbol: 'N', name: 'Nitrogen', color: '#5b9dff', electrons: 5 },
  { symbol: 'Na', name: 'Sodium', color: '#ffb454', electrons: 1 },
  { symbol: 'Cl', name: 'Chlorine', color: '#66ffa3', electrons: 7 },
]

const REACTIONS: Record<string, { name: string; formula: string; description: string }> = {
  'H,H,O': { name: 'Water', formula: '2H₂ + O₂ → 2H₂O', description: 'Two hydrogen atoms bond covalently with one oxygen atom.' },
  'Cl,Na': { name: 'Table Salt', formula: 'Na + Cl → NaCl', description: 'Sodium donates an electron to chlorine, forming an ionic bond.' },
  'C,O,O': { name: 'Carbon Dioxide', formula: 'C + O₂ → CO₂', description: 'Carbon forms double bonds with two oxygen atoms.' },
  'C,H,H,H,H': { name: 'Methane', formula: 'C + 4H → CH₄', description: 'Carbon shares electrons with four hydrogen atoms.' },
}

function Atom({ el, position }: { el: Element; position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.6
  })
  const shells = Math.min(3, Math.ceil(el.electrons / 3))
  return (
    <group position={position} ref={group}>
      <mesh>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color={el.color} emissive={el.color} emissiveIntensity={0.7} />
      </mesh>
      {Array.from({ length: shells }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 3 * i, Math.PI / 4 * i, 0]}>
          <torusGeometry args={[0.6 + i * 0.35, 0.008, 8, 64]} />
          <meshBasicMaterial color={el.color} transparent opacity={0.4} />
        </mesh>
      ))}
      <Html center distanceFactor={10}>
        <div className="pointer-events-none text-[10px] font-semibold text-white/80">{el.symbol}</div>
      </Html>
    </group>
  )
}

export default function ChemistryWorld() {
  const [bench, setBench] = useState<Element[]>([])
  const addXP = useUserStore((s) => s.addXP)

  const key = useMemo(() => bench.map((e) => e.symbol).sort().join(','), [bench])
  const reaction = REACTIONS[key]

  const add = (el: Element) => {
    if (bench.length >= 6) return
    setBench((b) => [...b, el])
  }
  const clear = () => setBench([])

  const positions = useMemo<[number, number, number][]>(() => {
    return bench.map((_, i) => {
      const angle = (i / Math.max(bench.length, 1)) * Math.PI * 2
      return [Math.cos(angle) * 1.6, 0, Math.sin(angle) * 1.6]
    })
  }, [bench])

  return (
    <div className="pb-8">
      <WorldHeader icon="🧪" title="Chemistry Laboratory" tagline="Combine elements and observe simulated reactions" color="#ff6ec7" worldId="chemistry" />

      <div className="grid grid-cols-1 gap-6 px-6 md:px-10 lg:grid-cols-4">
        <div className="glass overflow-hidden rounded-2xl lg:col-span-3">
          <div className="h-[420px] w-full">
            <Canvas camera={{ position: [0, 3, 6], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[4, 5, 4]} intensity={50} color="#ff6ec7" />
              {bench.map((el, i) => (
                <Atom key={i} el={el} position={positions[i]} />
              ))}
              <OrbitControls autoRotate autoRotateSpeed={0.8} />
            </Canvas>
          </div>
          <div className="border-t border-white/5 p-5">
            {reaction ? (
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">Reaction detected</span>
                  <span className="font-display text-sm font-semibold">{reaction.name}</span>
                </div>
                <div className="font-mono text-sm text-fuchsia-300">{reaction.formula}</div>
                <p className="mt-1 text-xs text-[var(--ev-text-dim)]">{reaction.description}</p>
              </div>
            ) : (
              <p className="text-xs text-[var(--ev-text-dim)]">
                {bench.length === 0
                  ? 'Add elements from the periodic panel to begin a reaction.'
                  : 'No known reaction for this combination yet — try H+H+O, Na+Cl, C+O+O, or C+4H.'}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold">Elements</h3>
              <button onClick={() => { clear(); }} className="text-xs text-[var(--ev-text-dim)] hover:text-white">Clear</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ELEMENTS.map((el) => (
                <button
                  key={el.symbol}
                  onClick={() => { add(el); addXP(1) }}
                  className="flex aspect-square flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:-translate-y-0.5 hover:border-white/25"
                  style={{ boxShadow: `inset 0 0 0 1px ${el.color}30` }}
                >
                  <span className="font-display text-lg font-bold" style={{ color: el.color }}>{el.symbol}</span>
                  <span className="text-[9px] text-[var(--ev-text-dim)]">{el.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-2 font-display text-sm font-semibold">Workbench</h3>
            <div className="flex flex-wrap gap-2">
              {bench.length === 0 && <span className="text-xs text-[var(--ev-text-dim)]">Empty — add atoms to react.</span>}
              {bench.map((el, i) => (
                <span key={i} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs" style={{ color: el.color }}>
                  {el.symbol}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
