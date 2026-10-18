import { createContext, useContext } from 'react'
import type { SubjectDef } from '../data/subjects'

export interface SubjectContextValue {
  activeSubject: SubjectDef | null
  clearActiveSubject: () => void
}

export const SubjectContext = createContext<SubjectContextValue>({
  activeSubject: null,
  clearActiveSubject: () => {},
})

export function useActiveSubject() {
  return useContext(SubjectContext)
}
