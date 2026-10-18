import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import WorldHeader from '../../components/layout/WorldHeader'

interface Landmark {
  id: string
  name: string
  lat: number
  lon: number
  type: string
  fact: string
}

const LANDMARKS: Landmark[] = [
  { id: 'everest', name: 'Mount Everest', lat: 27.98, lon: 86.92, type: 'Mountain', fact: 'The highest peak above sea level at 8,849m.' },
  { id: 'amazon', name: 'Amazon Basin', lat: -3.46, lon: -62.21, type: 'Rainforest', fact: 'Produces roughly 20% of the world\'s oxygen.' },
  { id: 'sahara', name: 'Sahara Desert', lat: 23.4, lon: 11.9, type: 'Desert', fact: 'The largest hot desert on Earth.' },
  { id: 'pacific', name: 'Pacific Ring of Fire', lat: 0, lon: -150, type: 'Seismic Zone', fact: 'Home to 75% of the world\'s active volcanoes.' },
  { id: 'antarctica', name: 'Antarctica', lat: -80, lon: 0, type: 'Ice Sheet', fact: 'Holds about 60% of the world\'s fresh water.' },
  { id: 'himalaya', name: 'Himalayan Belt', lat: 29, lon: 84, type: 'Earthquake Zone', fact: 'Formed by the Indian and Eurasian plates colliding.' },
]

function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

function Globe({ onSelect, selected }: { onSelect: (id: string) => void; selected: string | null }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.05
  })
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color="#0f2b3a" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshBasicMaterial color="#4fe3d0" wireframe transparent opacity={0.15} />
      </mesh>
      {LANDMARKS.map((l) => {
        const pos = latLonToVec3(l.lat, l.lon, 2.05)
        const isSelected = selected === l.id
        return (
          <group key={l.id} position={pos}>
            <mesh onClick={(e) => { e.stopPropagation(); onSelect(l.id) }}>
              <sphereGeometry args={[isSelected ? 0.09 : 0.06, 12, 12]} />
              <meshStandardMaterial color={isSelected ? '#ffb454' : '#ff6ec7'} emissive={isSelected ? '#ffb454' : '#ff6ec7'} emissiveIntensity={1} />
            </mesh>
            {isSelected && (
              <Html center distanceFactor={7}>
                <div className="w-40 rounded-lg border border-white/10 bg-black/85 p-2 text-[10px] text-white">
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-amber-300">{l.type}</div>
                  <div className="mt-1 text-[var(--ev-text-dim)]">{l.fact}</div>
                </div>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}

export default function GeographyWorld() {
  const [selected, setSelected] = useState<string | null>('everest')

  return (
    <div className="pb-8">
      <WorldHeader icon="🌍" title="Geography World" tagline="Explore an interactive 3D globe of Earth's features" color="#4fe3d0" worldId="geography" />

      <div className="grid grid-cols-1 gap-6 px-6 md:px-10 lg:grid-cols-4">
        <div className="glass overflow-hidden rounded-2xl lg:col-span-3">
          <div className="h-[480px] w-full">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[4, 4, 4]} intensity={50} color="#4fe3d0" />
              <Globe onSelect={setSelected} selected={selected} />
              <OrbitControls minDistance={3.5} maxDistance={9} />
            </Canvas>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="px-1 font-display text-sm font-semibold">Landmarks</h3>
          {LANDMARKS.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelected(l.id)}
              className={`w-full rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                selected === l.id ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-100' : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="font-medium">{l.name}</div>
              <div className="text-[10px] text-[var(--ev-text-dim)]">{l.type}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
