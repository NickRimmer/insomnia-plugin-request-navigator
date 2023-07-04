/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocBaseModel } from '../types'

let lastValue = ''
type Listener = (doc: DocBaseModel) => void
const listeners = new Set<Listener>()

export const notifyRequestSelected = (doc: DocBaseModel) => {
  const activeRequestId = (doc as any).activeRequestId
  if (!activeRequestId) return

  if (activeRequestId === lastValue) {
    return
  }

  listeners.forEach((listener) => listener(doc))
  lastValue = doc._id
}

export const onRequestSelected = (listener: Listener): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
