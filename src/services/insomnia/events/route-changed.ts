let lastValue = ''
type Listener = (route: string) => void
const listeners = new Set<Listener>()

export const notifyRouteChanged = (path: string) => {
  if (path === lastValue) return

  listeners.forEach((listener) => listener(path))
  lastValue = path
}

export const onRouteChanged = (listener: Listener): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
