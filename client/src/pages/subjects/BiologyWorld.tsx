import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import WorldHeader from '../../components/layout/WorldHeader'

const CHAMBERS = [
  { id: 'ra', name: 'Right Atrium', pos: [0.9, 0.7, 0.3] as const, color: '#5b9dff' },
  { id: 'rv', name: 'Right Ventricle', pos: [0.7, -0.6, 0.3] as const, color: '#4fe3d0' },
  { id: 'la', name: 'Left Atrium', pos: [-0.7, 0.7, 0.1] as const, color: '#ff6ec7' },
  { id: 'lv', name: 'Left Ventricle', pos: [-0.6, -0.6, 0.1] as const, color: '#ff4d6d' },
]

function BeatingHeart({ bpm, onSelect }: { bpm: number; onSelect: (id: string | null) => void }) {
  const group = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * (bpm / 60)
    const pulse = 1 + Math.max(0, Math.sin(t * Math.PI * 2)) * 0.08
    if (group.current) group.current.scale.setScalar(pulse)
  })
  return (
    <group ref={group}>
      <mesh onPointerOver={() => document.body.style.setProperty('cursor', 'pointer')} onPointerOut={() => document.body.style.setProperty('cursor', 'auto')}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshStandardMaterial color="#ff4d6d" roughness={0.4} emissive="#ff4d6d" emissiveIntensity={0.25} />
      </mesh>
      {CHAMBERS.map((c) => (
        <mesh
          key={c.id}
          position={c.pos as unknown as [number, number, number]}
          onClick={(e) => { e.stopPropagation(); onSelect(c.id) }}
        >
          <sphereGeometry args={[0.5, 20, 20]} />
          <meshStandardMaterial color={c.color} transparent opacity={0.55} emissive={c.color} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function BloodParticles({ bpm }: { bpm: number }) {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const n = 400
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 1.6 + Math.random() * 0.8
      arr[i * 3] = Math.cos(angle) * r
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3
      arr[i * 3 + 2] = Math.sin(angle) * r
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!points.current) return
    const arr = points.current.geometry.attributes.position.array as Float32Array
    const speed = (bpm / 60) * delta * 2
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] += speed
      if (arr[i + 1] > 1.8) arr[i + 1] = -1.8
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ff8fa3" size={0.05} transparent opacity={0.8} />
    </points>
  )
}

export default function BiologyWorld() {
  const [bpm, setBpm] = useState(72)
  const [selected, setSelected] = useState<string | null>(null)
  const chamber = CHAMBERS.find((c) => c.id === selected)

  return (
    <div className="pb-8">
      <WorldHeader icon="🧬" title="Biology Exploration Zone" tagline="Explore the human heart, DNA and living systems" color="#66ffa3" worldId="biology" />

      <div className="grid grid-cols-1 gap-6 px-6 md:px-10 lg:grid-cols-4">
        <div className="glass overflow-hidden rounded-2xl lg:col-span-3">
          <div className="h-[480px] w-full">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[4, 4, 4]} intensity={50} color="#ff6ec7" />
              <BeatingHeart bpm={bpm} onSelect={setSelected} />
              <BloodParticles bpm={bpm} />
              <OrbitControls autoRotate autoRotateSpeed={0.6} />
              {chamber && (
                <Html position={chamber.pos as unknown as [number, number, number]} center distanceFactor={9}>
                  <div className="whitespace-nowrap rounded-lg border border-white/10 bg-black/85 px-3 py-1.5 text-xs text-white">
                    {chamber.name}
                  </div>
                </Html>
              )}
            </Canvas>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Heart Rate</span>
              <span className="font-mono text-xs text-rose-300">{bpm} BPM</span>
            </div>
            <input type="range" min={40} max={180} value={bpm} onChange={(e) => setBpm(parseInt(e.target.value))} className="w-full accent-rose-400" />
            <p className="mt-2 text-[11px] text-[var(--ev-text-dim)]">Try raising the rate to simulate exercise and watch blood flow accelerate.</p>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-display text-sm font-semibold">Chambers</h3>
            <div className="space-y-2">
              {CHAMBERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition ${
                    selected === c.id ? 'border-white/30 bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5 text-xs leading-relaxed text-[var(--ev-text-dim)]">
            Blood flows: body → right atrium → right ventricle → lungs → left atrium → left ventricle → body.
            Click any chamber to highlight it in the 3D model.
          </div>
        </div>
      </div>
    </div>
  )
}
