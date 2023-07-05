/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocBaseModel } from '../types'

type Listener = (doc: DocBaseModel) => void
const listeners = new Set<Listener>()

export const notifyRequestDeleted = (doc: any) => {
  listeners.forEach((listener) => listener(doc))
}

export const onRequestDeleted = (listener: Listener): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
