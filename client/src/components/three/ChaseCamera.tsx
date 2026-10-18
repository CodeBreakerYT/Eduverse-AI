import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const OFFSET = new THREE.Vector3(0, 6.5, 8.5)

export default function ChaseCamera({ targetRef }: { targetRef: React.MutableRefObject<THREE.Vector3> }) {
  const { camera } = useThree()
  const initialized = useRef(false)

  useFrame((_, delta) => {
    const target = targetRef.current
    const desired = target.clone().add(OFFSET)
    if (!initialized.current) {
      camera.position.copy(desired)
      initialized.current = true
    } else {
      camera.position.lerp(desired, Math.min(1, 3.2 * delta))
    }
    const lookTarget = target.clone().add(new THREE.Vector3(0, 0.6, 0))
    camera.lookAt(lookTarget)
  })

  return null
}
