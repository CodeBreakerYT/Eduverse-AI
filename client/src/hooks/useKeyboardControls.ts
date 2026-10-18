import { useEffect, useRef } from 'react'

export interface MovementKeys {
  forward: boolean
  back: boolean
  left: boolean
  right: boolean
  boost: boolean
}

const FORWARD = new Set(['KeyW', 'ArrowUp'])
const BACK = new Set(['KeyS', 'ArrowDown'])
const LEFT = new Set(['KeyA', 'ArrowLeft'])
const RIGHT = new Set(['KeyD', 'ArrowRight'])
const BOOST = new Set(['Space'])

export function useKeyboardControls() {
  const keysRef = useRef<MovementKeys>({ forward: false, back: false, left: false, right: false, boost: false })

  useEffect(() => {
    const pressed = new Set<string>()

    const recompute = () => {
      keysRef.current = {
        forward: [...pressed].some((k) => FORWARD.has(k)),
        back: [...pressed].some((k) => BACK.has(k)),
        left: [...pressed].some((k) => LEFT.has(k)),
        right: [...pressed].some((k) => RIGHT.has(k)),
        boost: [...pressed].some((k) => BOOST.has(k)),
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.matches('input, textarea, [contenteditable]')) return
      if (e.code === 'Space') e.preventDefault()
      pressed.add(e.code)
      recompute()
    }
    const onKeyUp = (e: KeyboardEvent) => {
      pressed.delete(e.code)
      recompute()
    }
    // Prevent keys getting "stuck" held down if the tab loses focus mid-press
    const onBlur = () => {
      pressed.clear()
      recompute()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  return keysRef
}
