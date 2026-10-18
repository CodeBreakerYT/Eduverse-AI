import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Line, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { TopicProgress } from '../../store/useUserStore'

function masteryColor(m: number) {
  if (m >= 85) return '#4fe3d0'
  if (m >= 55) return '#8b7cff'
  if (m >= 30) return '#ffb454'
  return '#ff6ec7'
}

function Node({ topic, position }: { topic: TopicProgress; position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.15
      const s = hovered ? 1.4 : 1
      ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.15)
    }
  })
  const size = 0.25 + (topic.mastery / 100) * 0.35
  const color = masteryColor(topic.mastery)
  return (
    <group position={position}>
      <mesh ref={ref} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 1.4 : 0.7} toneMapped={false} />
      </mesh>
      {hovered && (
        <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div className="whitespace-nowrap rounded-lg border border-white/10 bg-black/80 px-3 py-1.5 text-xs text-white backdrop-blur">
            <div className="font-semibold">{topic.name}</div>
            <div className="text-[10px] text-[var(--ev-text-dim)]">{topic.mastery}% mastery · {topic.subject}</div>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function KnowledgeConstellation({ topics }: { topics: TopicProgress[] }) {
  const positions = useMemo<[number, number, number][]>(() => {
    const n = topics.length
    return topics.map((_, i) => {
      const angle = (i / n) * Math.PI * 2
      const radius = 2.4 + (i % 3) * 0.9
      return [Math.cos(angle) * radius, Math.sin(angle * 1.3) * 1.2, Math.sin(angle) * radius]
    })
  }, [topics])

  return (
    <div className="h-[420px] w-full">
      <Canvas camera={{ position: [0, 1.5, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={40} color="#8b7cff" />
        {positions.map((p, i) => {
          const next = positions[(i + 1) % positions.length]
          return (
            <Line
              key={`line-${i}`}
              points={[p, next]}
              color="#3d3f52"
              lineWidth={1}
              transparent
              opacity={0.35}
            />
          )
        })}
        {topics.map((t, i) => (
          <Node key={t.id} topic={t} position={positions[i]} />
        ))}
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.6} minDistance={4} maxDistance={14} />
      </Canvas>
    </div>
  )
}
