import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Line, OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import WorldHeader from '../../components/layout/WorldHeader'
import { useUserStore } from '../../store/useUserStore'

const FUNCTIONS = [
  { id: 'sin', label: 'sin(x) · cos(y)', fn: (x: number, y: number) => Math.sin(x) * Math.cos(y) },
  { id: 'ripple', label: 'sin(√(x²+y²))', fn: (x: number, y: number) => Math.sin(Math.sqrt(x * x + y * y)) },
  { id: 'saddle', label: 'x² − y² (saddle)', fn: (x: number, y: number) => (x * x - y * y) / 4 },
  { id: 'gauss', label: 'Gaussian bump', fn: (x: number, y: number) => 2 * Math.exp(-(x * x + y * y) / 6) },
]

function SurfacePlot({ fn, amplitude }: { fn: (x: number, y: number) => number; amplitude: number }) {
  const geometry = useMemo(() => {
    const size = 8
    const seg = 60
    const geo = new THREE.PlaneGeometry(size, size, seg, seg)
    const pos = geo.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const c1 = new THREE.Color('#4fe3d0')
    const c2 = new THREE.Color('#8b7cff')
    const c3 = new THREE.Color('#ff6ec7')
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = fn(x, y) * amplitude
      pos.setZ(i, z)
      const t = (z + amplitude) / (2 * amplitude)
      const color = t < 0.5 ? c1.clone().lerp(c2, t * 2) : c2.clone().lerp(c3, (t - 0.5) * 2)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [fn, amplitude])

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2.6, 0, 0]}>
      <meshStandardMaterial vertexColors wireframe={false} side={THREE.DoubleSide} roughness={0.4} metalness={0.2} />
    </mesh>
  )
}

function Axes() {
  return (
    <group>
      <Line points={[[-4.5, 0, 0], [4.5, 0, 0]]} color="#3d3f52" />
      <Line points={[[0, -2, 0], [0, 4, 0]]} color="#3d3f52" />
      <Line points={[[0, 0, -4.5], [0, 0, 4.5]]} color="#3d3f52" />
      <Text position={[4.8, 0, 0]} fontSize={0.3} color="#8b8fa3">x</Text>
      <Text position={[0, 4.3, 0]} fontSize={0.3} color="#8b8fa3">z</Text>
      <Text position={[0, 0, 4.8]} fontSize={0.3} color="#8b8fa3">y</Text>
    </group>
  )
}

export default function MathWorld() {
  const [fnId, setFnId] = useState('ripple')
  const [amplitude, setAmplitude] = useState(1.6)
  const [autoRotate, setAutoRotate] = useState(true)
  const addXP = useUserStore((s) => s.addXP)
  const active = FUNCTIONS.find((f) => f.id === fnId)!

  return (
    <div className="pb-8">
      <WorldHeader icon="🔢" title="The Mathematics Dimension" tagline="Floating equations, 3D graphs & interactive vector fields" color="#5b9dff" worldId="math" />

      <div className="grid grid-cols-1 gap-6 px-6 md:px-10 lg:grid-cols-4">
        <div className="glass overflow-hidden rounded-2xl lg:col-span-3">
          <div className="h-[480px] w-full">
            <Canvas
              camera={{ position: [6, 5, 6], fov: 50 }}
              onPointerDown={() => addXP(1)}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[6, 8, 4]} intensity={60} color="#8b7cff" />
              <pointLight position={[-6, -4, -4]} intensity={30} color="#4fe3d0" />
              <Axes />
              <SurfacePlot fn={active.fn} amplitude={amplitude} />
              <OrbitControls autoRotate={autoRotate} autoRotateSpeed={1.2} />
            </Canvas>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-display text-sm font-semibold">Function</h3>
            <div className="space-y-2">
              {FUNCTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFnId(f.id)}
                  className={`w-full rounded-lg border px-3 py-2 text-left font-mono text-xs transition ${
                    fnId === f.id ? 'border-blue-400/60 bg-blue-500/10 text-blue-200' : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  z = {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-display text-sm font-semibold">Amplitude</h3>
            <input
              type="range"
              min={0.4}
              max={3}
              step={0.1}
              value={amplitude}
              onChange={(e) => setAmplitude(parseFloat(e.target.value))}
              className="w-full accent-violet-400"
            />
            <div className="mt-1 font-mono text-xs text-[var(--ev-text-dim)]">{amplitude.toFixed(1)}x</div>
          </div>

          <label className="glass flex items-center justify-between rounded-2xl p-5 text-sm">
            Auto-rotate
            <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} className="accent-violet-400" />
          </label>

          <div className="glass rounded-2xl p-5 text-xs leading-relaxed text-[var(--ev-text-dim)]">
            Drag to orbit, scroll to zoom. Every surface point is colored by height — watch how changing amplitude
            reshapes the curvature of the function in real time.
          </div>
        </div>
      </div>
    </div>
  )
}
