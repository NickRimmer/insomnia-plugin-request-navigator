/* eslint-disable @typescript-eslint/no-explicit-any */
import { InsomniaDocBase } from '../types'

let lastValue = ''
type Listener = (doc: InsomniaDocBase) => void
const listeners = new Set<Listener>()

export const notifyRequestSelected = (doc: InsomniaDocBase) => {
  const activeRequestId = doc._id
  if (activeRequestId === lastValue) {
    return
  }

  lastValue = doc._id
  listeners.forEach((listener) => listener(doc))
}

export const onRequestSelected = (listener: Listener): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
