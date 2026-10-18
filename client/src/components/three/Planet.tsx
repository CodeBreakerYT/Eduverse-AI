import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import type { SubjectDef } from '../../data/subjects'

function hexToRgb(hex: string) {
  const v = parseInt(hex.replace('#', ''), 16)
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 }
}

function shade(rgb: { r: number; g: number; b: number }, amt: number) {
  const c = (x: number) => Math.max(0, Math.min(255, Math.round(x + amt)))
  return `rgb(${c(rgb.r)},${c(rgb.g)},${c(rgb.b)})`
}

// Procedurally paint a small canvas so each planet reads as a real textured
// sphere (bands + craters) instead of a flat-shaded primitive.
function usePlanetTexture(color: string, seed: number) {
  return useMemo(() => {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const rgb = hexToRgb(color)

    ctx.fillStyle = shade(rgb, -40)
    ctx.fillRect(0, 0, size, size)

    let rand = seed * 9301 + 49297
    const rnd = () => {
      rand = (rand * 9301 + 49297) % 233280
      return rand / 233280
    }
    const bandCount = 5 + Math.floor(rnd() * 3)
    for (let i = 0; i < bandCount; i++) {
      const y = (i / bandCount) * size + (rnd() - 0.5) * 10
      const h = size / bandCount + (rnd() - 0.5) * 8
      ctx.fillStyle = shade(rgb, (rnd() - 0.5) * 60)
      ctx.globalAlpha = 0.35 + rnd() * 0.3
      ctx.fillRect(0, y, size, h)
    }

    ctx.globalAlpha = 0.5
    for (let i = 0; i < 14; i++) {
      const x = rnd() * size
      const y = rnd() * size
      const r = 4 + rnd() * 14
      ctx.fillStyle = shade(rgb, rnd() > 0.5 ? 30 + rnd() * 30 : -30 - rnd() * 30)
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.globalAlpha = 1
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [color, seed])
}

function useTextTexture(icon: string, name: string, small = false) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 96
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.textAlign = 'center'
    if (icon) {
      ctx.font = `${small ? 30 : 44}px "Segoe UI Emoji", sans-serif`
      ctx.fillText(icon, canvas.width / 2, small ? 40 : 52)
    }
    ctx.font = `600 ${small ? 17 : 20}px system-ui, sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.shadowColor = 'rgba(0,0,0,0.85)'
    ctx.shadowBlur = 6
    ctx.fillText(name, canvas.width / 2, small ? 68 : 84)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [icon, name, small])
}

function Moon({ topic, color, orbitRadius, speed, phase }: { topic: string; color: string; orbitRadius: number; speed: number; phase: number }) {
  const group = useRef<THREE.Group>(null)
  const labelMap = useTextTexture('', topic, true)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase
    if (group.current) {
      group.current.position.set(Math.cos(t) * orbitRadius, Math.sin(t * 1.7) * 0.25, Math.sin(t) * orbitRadius)
    }
  })

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} roughness={0.5} />
      </mesh>
      <Billboard position={[0, 0.32, 0]}>
        <mesh scale={0.7}>
          <planeGeometry args={[2, 0.75]} />
          <meshBasicMaterial map={labelMap} transparent depthWrite={false} opacity={0.85} />
        </mesh>
      </Billboard>
    </group>
  )
}

export default function Planet({
  subject,
  orbitRadius,
  orbitSpeed,
  phase,
  near,
  topics,
  onPositionUpdate,
}: {
  subject: SubjectDef
  orbitRadius: number
  orbitSpeed: number
  phase: number
  near: boolean
  topics: string[]
  onPositionUpdate: (pos: THREE.Vector3) => void
}) {
  const planet = useRef<THREE.Mesh>(null)
  const ring = useRef<THREE.Mesh>(null)
  const group = useRef<THREE.Group>(null)
  const atmosphere = useRef<THREE.Mesh>(null)

  const seed = useMemo(() => subject.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0), [subject.id])
  const surfaceMap = usePlanetTexture(subject.color, seed)
  const labelMap = useTextTexture(subject.icon, subject.name)

  const moonColors = ['#ffffff', '#e2e8ff', '#cbd5ff']

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()
    const angle = t * orbitSpeed + phase
    if (group.current) {
      group.current.position.set(Math.cos(angle) * orbitRadius, 1.3 + Math.sin(t * 0.6 + phase) * 0.25, Math.sin(angle) * orbitRadius)
      onPositionUpdate(group.current.position)
    }
    if (planet.current) planet.current.rotation.y += delta * 0.4
    if (ring.current) ring.current.rotation.z += delta * 0.1
    if (atmosphere.current) {
      const mat = atmosphere.current.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, near ? 0.35 : 0.16, 0.08)
    }
  })

  const radius = 1.15

  return (
    <group ref={group}>
      <mesh ref={planet}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial map={surfaceMap} emissive={subject.color} emissiveIntensity={near ? 0.55 : 0.22} roughness={0.75} metalness={0.05} />
      </mesh>

      <mesh ref={atmosphere} scale={1.18}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial color={subject.color} transparent opacity={0.16} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[radius + 0.55, 0.02, 8, 48]} />
        <meshBasicMaterial color={subject.color} transparent opacity={near ? 0.7 : 0.35} toneMapped={false} />
      </mesh>

      {topics.map((topic, i) => (
        <Moon
          key={topic}
          topic={topic}
          color={moonColors[i % moonColors.length]}
          orbitRadius={radius + 1.1 + i * 0.55}
          speed={0.9 - i * 0.15}
          phase={i * 2.4}
        />
      ))}

      <Billboard position={[0, radius + 1, 0]}>
        <mesh scale={near ? 1.15 : 1}>
          <planeGeometry args={[2, 0.75]} />
          <meshBasicMaterial map={labelMap} transparent depthWrite={false} />
        </mesh>
      </Billboard>
    </group>
  )
}
