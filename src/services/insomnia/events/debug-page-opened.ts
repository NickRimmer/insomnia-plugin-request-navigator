let lastValue: boolean | undefined = undefined
type Listener = (opened: boolean) => void
const listeners = new Set<Listener>()

export const notifyDebugPageOpenChanged = (opened: boolean) => {
  if (lastValue === opened) return

  listeners.forEach((listener) => listener(opened))
  lastValue = opened
}

export const onDebugPageOpenChanged = (listener: Listener): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
