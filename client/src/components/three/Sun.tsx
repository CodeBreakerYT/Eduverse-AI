import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'

function useNameTexture(initial: string, name: string) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 320
    canvas.height = 110
    const ctx = canvas.getContext('2d')!
    ctx.textAlign = 'center'
    ctx.font = '46px system-ui, sans-serif'
    ctx.fillStyle = '#1a1206'
    ctx.fillText(initial, canvas.width / 2, 58)
    ctx.font = '600 22px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.shadowColor = 'rgba(0,0,0,0.85)'
    ctx.shadowBlur = 8
    ctx.fillText(name, canvas.width / 2, 96)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [initial, name])
}

export default function Sun({ name, near }: { name: string; near: boolean }) {
  const core = useRef<THREE.Mesh>(null)
  const corona = useRef<THREE.Mesh>(null)
  const flare = useRef<THREE.Mesh>(null)
  const labelMap = useNameTexture((name || '?').charAt(0).toUpperCase(), name)
  const radius = 1.7

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()
    if (core.current) core.current.rotation.y += delta * 0.08
    if (corona.current) {
      const pulse = 1 + Math.sin(t * 1.4) * 0.04
      corona.current.scale.setScalar(pulse * (near ? 1.12 : 1))
    }
    if (flare.current) {
      flare.current.rotation.z += delta * 0.05
      const mat = flare.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.18 + Math.sin(t * 2) * 0.05 + (near ? 0.12 : 0)
    }
  })

  return (
    <group position={[0, 1.4, 0]}>
      <mesh ref={core}>
        <sphereGeometry args={[radius, 40, 40]} />
        <meshStandardMaterial color="#ffcf6b" emissive="#ff9f2e" emissiveIntensity={2.2} roughness={0.4} toneMapped={false} />
      </mesh>

      <mesh ref={corona} scale={1.35}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial color="#ffb454" transparent opacity={0.2} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      <mesh ref={flare} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius + 0.3, radius + 1.4, 64]} />
        <meshBasicMaterial color="#ffd27a" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>

      <pointLight color="#ffcf8a" intensity={90} distance={40} decay={1.6} />

      <Billboard position={[0, radius + 1.1, 0]}>
        <mesh scale={near ? 1.15 : 1}>
          <planeGeometry args={[2.4, 0.85]} />
          <meshBasicMaterial map={labelMap} transparent depthWrite={false} />
        </mesh>
      </Billboard>
    </group>
  )
}
