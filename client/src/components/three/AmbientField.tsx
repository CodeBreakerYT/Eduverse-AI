import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Stars({ count = 2000, color = '#8b7cff' }: { count?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 30 + Math.random() * 40
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01
      ref.current.rotation.x += delta * 0.003
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.15} sizeAttenuation transparent opacity={0.7} />
    </points>
  )
}

function DriftingOrbs() {
  const group = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.3 + i * 2) * 3
      child.position.x = Math.cos(t * 0.2 + i * 3) * 4
    })
  })
  const colors = ['#4fe3d0', '#8b7cff', '#ff6ec7']
  return (
    <group ref={group}>
      {colors.map((c, i) => (
        <mesh key={c} position={[i * 6 - 6, 0, -10 - i * 4]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial color={c} transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  )
}

export default function AmbientField({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }} dpr={[1, 1.5]}>
        <Stars />
        <DriftingOrbs />
      </Canvas>
    </div>
  )
}
