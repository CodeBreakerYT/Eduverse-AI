import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import Planet from './Planet'
import Sun from './Sun'
import AdventureOrb from './AdventureOrb'
import ChaseCamera from './ChaseCamera'
import { useKeyboardControls } from '../../hooks/useKeyboardControls'
import { QUESTION_BANK } from '../../data/questions'
import { VIDEO_POOL } from '../../data/subjects'
import type { HubPlanet } from '../../data/subjects'

const ENTER_RADIUS = 2.1
const SUN_ENTER_RADIUS = 2.8
const SUN_ID = '__sun__'
// Innermost orbit must stay well clear of the spawn point (radius 4.5 from
// the sun) — otherwise a planet's own orbit can drift within ENTER_RADIUS of
// a *stationary* orb and "auto-enter" it with no player input at all.
const FIRST_ORBIT_RADIUS = 9
const ORBIT_GAP = 2.3

// Each planet is now labeled with the student's actual subject (e.g.
// "Structural Analysis"), so its moons show related sub-topics from that
// world's videos/practice questions instead — giving extra depth without
// repeating the planet's own label.
function topicsForWorld(worldName: string): string[] {
  const seen = new Set<string>()
  for (const v of VIDEO_POOL) {
    if (v.subject === worldName) seen.add(v.topic)
  }
  if (seen.size < 3) {
    for (const q of QUESTION_BANK) {
      if (q.subject === worldName) seen.add(q.topic)
    }
  }
  return [...seen].slice(0, 3)
}

function OrbitRing({ radius, color }: { radius: number; color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 96]} />
      <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

function ProximityController({
  targets,
  positionsRef,
  onNearChange,
  entering,
  frozen,
  orbPos,
}: {
  targets: { id: string; radius: number }[]
  positionsRef: React.MutableRefObject<Record<string, THREE.Vector3>>
  orbPos: React.MutableRefObject<THREE.Vector3>
  onNearChange: (id: string | null) => void
  entering: string | null
  frozen: boolean
}) {
  const lastNear = useRef<string | null>(null)
  useEffect(() => {
    if (!frozen) lastNear.current = null
  }, [frozen])
  useFrame(() => {
    if (entering || frozen) return
    let closest: string | null = null
    let closestScore = Infinity
    for (const t of targets) {
      const p = positionsRef.current[t.id]
      if (!p) continue
      const dx = orbPos.current.x - p.x
      const dz = orbPos.current.z - p.z
      const d = Math.sqrt(dx * dx + dz * dz)
      if (d < t.radius && d < closestScore) {
        closestScore = d
        closest = t.id
      }
    }
    if (closest !== lastNear.current) {
      lastNear.current = closest
      onNearChange(closest)
    }
  })
  return null
}

export default function WorldHubScene({
  worlds,
  profileName,
  onEnter,
  onNearChange,
  frozen = false,
}: {
  worlds: HubPlanet[]
  profileName: string
  onEnter: (route: string) => void
  onNearChange: (subject: { id: string; name: string; color: string; icon: string } | null) => void
  frozen?: boolean
}) {
  const keysRef = useKeyboardControls()
  const orbPos = useRef(new THREE.Vector3(0, 0.9, 4.5))
  const [nearId, setNearId] = useState<string | null>(null)
  const [entering, setEntering] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)

  const positionsRef = useRef<Record<string, THREE.Vector3>>({ [SUN_ID]: new THREE.Vector3(0, 0, 0) })

  // Whenever we return to the free-roam hub (frozen -> false), clear
  // whatever "near/entering" state was left over from the last visit —
  // otherwise the orb stays permanently locked and the "Entering…" HUD
  // never goes away — and teleport the orb back to spawn, since it's
  // still sitting on the planet it just entered and would otherwise
  // instantly re-trigger the same planet again.
  useEffect(() => {
    if (!frozen) {
      setEntering(null)
      setNearId(null)
      onNearChange(null)
      setResetKey((k) => k + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frozen])

  const orbits = useMemo(() => {
    const golden = 2.4
    return worlds.map((_, i) => ({
      radius: FIRST_ORBIT_RADIUS + i * ORBIT_GAP,
      speed: 0.09 - i * 0.007,
      phase: i * golden,
    }))
  }, [worlds])

  const targets = useMemo(
    () => [{ id: SUN_ID, radius: SUN_ENTER_RADIUS }, ...worlds.map((w) => ({ id: w.id, radius: ENTER_RADIUS }))],
    [worlds],
  )

  const routeFor = (id: string) => (id === SUN_ID ? '/profile' : worlds.find((w) => w.id === id)?.route)
  const infoFor = (id: string) =>
    id === SUN_ID
      ? { id: SUN_ID, name: `${profileName ? `${profileName}'s` : 'Your'} Profile`, color: '#ffb454', icon: '☀️' }
      : (() => {
          const w = worlds.find((x) => x.id === id)
          return w ? { id: w.id, name: w.name, color: w.color, icon: w.icon } : null
        })()

  const handleNearChange = (id: string | null) => {
    setNearId(id)
    onNearChange(id ? infoFor(id) : null)
    if (id && !entering) {
      const route = routeFor(id)
      if (!route) return
      setEntering(id)
      setTimeout(() => onEnter(route), 850)
    }
  }

  return (
    <>
      <color attach="background" args={['#03040a']} />
      <fog attach="fog" args={['#03040a', 18, 42]} />

      <ambientLight intensity={0.25} />
      <hemisphereLight args={['#4fe3d0', '#0a0612', 0.2]} />

      <Stars radius={80} depth={40} count={1600} factor={2.4} fade speed={0.3} />

      {orbits.map((o, i) => (
        <OrbitRing key={worlds[i].id} radius={o.radius} color={worlds[i].color} />
      ))}

      <Sun name={profileName} near={nearId === SUN_ID} />

      {worlds.map((w, i) => (
        <Planet
          key={w.id}
          subject={w}
          orbitRadius={orbits[i].radius}
          orbitSpeed={orbits[i].speed}
          phase={orbits[i].phase}
          near={nearId === w.id}
          topics={topicsForWorld(w.worldName)}
          onPositionUpdate={(p) => {
            if (!positionsRef.current[w.id]) positionsRef.current[w.id] = new THREE.Vector3()
            positionsRef.current[w.id].copy(p)
          }}
        />
      ))}

      <AdventureOrb keysRef={keysRef} onMove={(p) => orbPos.current.copy(p)} locked={!!entering || frozen} resetKey={resetKey} />
      <ProximityController targets={targets} positionsRef={positionsRef} orbPos={orbPos} onNearChange={handleNearChange} entering={entering} frozen={frozen} />
      <ChaseCamera targetRef={orbPos} />
    </>
  )
}
