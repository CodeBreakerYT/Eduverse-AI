import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'
import type { MovementKeys } from '../../hooks/useKeyboardControls'

const BOUND = 27
const BASE_SPEED = 6.5
const BOOST_MULT = 2.1
const ACCEL = 14
const SPAWN = new THREE.Vector3(0, 0.9, 4.5)

export interface OrbHandle {
  group: THREE.Group | null
}

export default function AdventureOrb({
  keysRef,
  onMove,
  locked,
  resetKey,
}: {
  keysRef: React.MutableRefObject<MovementKeys>
  onMove: (pos: THREE.Vector3) => void
  locked: boolean
  resetKey?: number
}) {
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const velocity = useRef(new THREE.Vector2(0, 0))
  const boosting = useRef(0)

  // Teleport back to spawn whenever we return to the hub — otherwise the
  // orb is still sitting right on top of whichever planet it just entered,
  // and proximity detection would instantly re-trigger that same planet.
  useEffect(() => {
    if (group.current) {
      group.current.position.copy(SPAWN)
      group.current.rotation.set(0, 0, 0)
    }
    velocity.current.set(0, 0)
    onMove(SPAWN)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const k = keysRef.current
    const g = group.current
    if (!g) return

    if (!locked) {
      const input = new THREE.Vector2(
        (k.right ? 1 : 0) - (k.left ? 1 : 0),
        (k.back ? 1 : 0) - (k.forward ? 1 : 0),
      )
      if (input.lengthSq() > 0) input.normalize()

      const targetSpeed = BASE_SPEED * (k.boost ? BOOST_MULT : 1)
      const target = input.multiplyScalar(targetSpeed)
      velocity.current.lerp(target, Math.min(1, ACCEL * dt))

      g.position.x = THREE.MathUtils.clamp(g.position.x + velocity.current.x * dt, -BOUND, BOUND)
      g.position.z = THREE.MathUtils.clamp(g.position.z + velocity.current.y * dt, -BOUND, BOUND)

      boosting.current = THREE.MathUtils.lerp(boosting.current, k.boost ? 1 : 0, Math.min(1, 8 * dt))

      // face travel direction
      if (velocity.current.lengthSq() > 0.05) {
        const targetAngle = Math.atan2(velocity.current.x, velocity.current.y) + Math.PI
        let da = targetAngle - g.rotation.y
        da = Math.atan2(Math.sin(da), Math.cos(da))
        g.rotation.y += da * Math.min(1, 6 * dt)
      }

      onMove(g.position)
    } else {
      velocity.current.set(0, 0)
    }

    const t = state.clock.getElapsedTime()
    g.position.y = 0.9 + Math.sin(t * 1.8) * 0.08
    if (core.current) {
      core.current.rotation.y += dt * (0.8 + boosting.current * 2)
      const mat = core.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1.1 + boosting.current * 1.4
    }
  })

  return (
    <group ref={group} position={[0, 0.9, 4.5]}>
      <Trail width={2.2} length={5} color="#8b7cff" attenuation={(t) => t * t} local>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial color="#c084fc" emissive="#8b7cff" emissiveIntensity={1.1} roughness={0.25} metalness={0.5} />
        </mesh>
      </Trail>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.75, 0.85, 32]} />
        <meshBasicMaterial color="#4fe3d0" transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <pointLight color="#8b7cff" intensity={30} distance={7} />
    </group>
  )
}
