import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Trail } from '@react-three/drei'
import * as THREE from 'three'
import WorldHeader from '../../components/layout/WorldHeader'

function OrbitingBody({ mass, gravity, speed }: { mass: number; gravity: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const angle = useRef(0)
  useFrame((_, delta) => {
    angle.current += delta * speed * (0.4 + gravity * 0.15)
    const radius = 3.4 - gravity * 0.25
    if (ref.current) {
      ref.current.position.set(Math.cos(angle.current) * radius, Math.sin(angle.current * 0.6) * 0.6, Math.sin(angle.current) * radius)
    }
  })
  const size = 0.2 + mass * 0.06
  return (
    <Trail width={2} length={6} color="#4fe3d0" attenuation={(t) => t}>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial color="#4fe3d0" emissive="#4fe3d0" emissiveIntensity={0.6} />
      </mesh>
    </Trail>
  )
}

function CentralMass({ gravity }: { gravity: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.7 + gravity * 0.05, 32, 32]} />
      <meshStandardMaterial color="#ff6ec7" emissive="#ff6ec7" emissiveIntensity={0.4} roughness={0.3} />
    </mesh>
  )
}

function ProjectileScene({ force, mass, angleDeg }: { force: number; mass: number; angleDeg: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const t = useRef(0)
  const g = 9.8
  const v0 = force / mass
  const rad = (angleDeg * Math.PI) / 180

  useFrame((_, delta) => {
    t.current += delta * 1.4
    const vx = v0 * Math.cos(rad)
    const vy = v0 * Math.sin(rad)
    const x = vx * t.current
    const y = vy * t.current - 0.5 * g * t.current * t.current
    if (y < 0) t.current = 0
    if (ref.current) ref.current.position.set(x - 3, Math.max(y, 0), 0)
  })

  const points: [number, number, number][] = []
  const vx = v0 * Math.cos(rad)
  const vy = v0 * Math.sin(rad)
  for (let i = 0; i <= 40; i++) {
    const tt = (i / 40) * ((2 * vy) / g || 0.01)
    const x = vx * tt
    const y = vy * tt - 0.5 * g * tt * tt
    if (y >= 0) points.push([x - 3, y, 0])
  }

  return (
    <group>
      {points.length > 1 && (
        <primitive
          object={new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(...p))),
            new THREE.LineBasicMaterial({ color: '#8b7cff', transparent: true, opacity: 0.5 }),
          )}
        />
      )}
      <mesh position={[-3, 0, 0]}>
        <boxGeometry args={[6, 0.05, 2]} />
        <meshStandardMaterial color="#1a1c26" />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial color="#ffb454" emissive="#ffb454" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

export default function PhysicsWorld() {
  const [mode, setMode] = useState<'gravity' | 'projectile'>('gravity')
  const [gravity, setGravity] = useState(5)
  const [mass, setMass] = useState(2)
  const [speed, setSpeed] = useState(1)
  const [force, setForce] = useState(12)
  const [angle, setAngle] = useState(45)

  return (
    <div className="pb-8">
      <WorldHeader icon="⚛️" title="Physics Laboratory" tagline="Manipulate gravity, force and motion in real time" color="#4fe3d0" worldId="physics" />

      <div className="mb-4 flex gap-2 px-6 md:px-10">
        {(['gravity', 'projectile'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg border px-4 py-2 text-xs font-medium capitalize transition ${
              mode === m ? 'border-teal-400/60 bg-teal-500/10 text-teal-200' : 'border-white/10 bg-white/5 text-[var(--ev-text-dim)]'
            }`}
          >
            {m === 'gravity' ? 'Orbital Gravity' : 'Projectile Motion'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 px-6 md:px-10 lg:grid-cols-4">
        <div className="glass overflow-hidden rounded-2xl lg:col-span-3">
          <div className="h-[480px] w-full">
            <Canvas camera={{ position: mode === 'gravity' ? [5, 3, 5] : [0, 2, 8], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 5, 5]} intensity={50} color="#4fe3d0" />
              {mode === 'gravity' ? (
                <>
                  <CentralMass gravity={gravity} />
                  <OrbitingBody mass={mass} gravity={gravity} speed={speed} />
                </>
              ) : (
                <ProjectileScene force={force} mass={mass} angleDeg={angle} />
              )}
              <OrbitControls autoRotate={mode === 'gravity'} autoRotateSpeed={0.4} />
            </Canvas>
          </div>
        </div>

        <div className="space-y-4">
          {mode === 'gravity' ? (
            <>
              <Slider label="Gravitational Pull" value={gravity} setValue={setGravity} min={1} max={10} />
              <Slider label="Orbiting Mass" value={mass} setValue={setMass} min={0.5} max={5} step={0.1} />
              <Slider label="Orbit Speed" value={speed} setValue={setSpeed} min={0.2} max={3} step={0.1} />
              <div className="glass rounded-2xl p-5 text-xs leading-relaxed text-[var(--ev-text-dim)]">
                Increasing the central mass's gravity tightens the orbit radius — just like a real gravitational
                well. Try dragging gravity to max and watch the orbit collapse inward.
              </div>
            </>
          ) : (
            <>
              <Slider label="Launch Force (N)" value={force} setValue={setForce} min={4} max={24} />
              <Slider label="Mass (kg)" value={mass} setValue={setMass} min={0.5} max={5} step={0.1} />
              <Slider label="Launch Angle (°)" value={angle} setValue={setAngle} min={10} max={80} />
              <div className="glass rounded-2xl p-5 text-xs leading-relaxed text-[var(--ev-text-dim)]">
                v₀ = F / m. Watch how a heavier mass flattens the trajectory for the same force, exactly as
                Newton's second law predicts.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Slider({
  label,
  value,
  setValue,
  min,
  max,
  step = 1,
}: {
  label: string
  value: number
  setValue: (v: number) => void
  min: number
  max: number
  step?: number
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-xs text-teal-300">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => setValue(parseFloat(e.target.value))} className="w-full accent-teal-400" />
    </div>
  )
}
