/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocBaseModel } from '../types'

let lastValue: any = {}
type Listener = (doc: DocBaseModel) => void
const listeners = new Set<Listener>()

export const notifyRequestUpdated = (doc: any) => {
  let changed = false
  for (const key in doc) {
    if (doc[key] != lastValue[key]) changed = true
  }

  if (!changed) return

  listeners.forEach((listener) => listener(doc))
  lastValue = doc
}

export const onRequestUpdated = (listener: Listener): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
