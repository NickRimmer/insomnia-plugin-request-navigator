import { InsomniaRouter, InsomniaRouterEvent } from '../types'
import { isCurrentConnectionStillActive } from './refs-common'

let internalRouter: InsomniaRouter = {} as InsomniaRouter

export const initRouter = (): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootElement = document.querySelector('#root') as any
  if (!rootElement) {
    console.error('[plugin-navigator]', 'root element not found')
    return false
  }

  const containerElement = Object.getOwnPropertyNames(rootElement).findLast(x => x.startsWith('__reactContainer'))
  if (!containerElement) {
    console.warn('[plugin-navigator]', 'store container element not found')
    return false
  }

  internalRouter = rootElement[containerElement].memoizedState.element.props.router
  return true
}

export const getRouter = (): InsomniaRouter => internalRouter

export const subscribeForRouteChanged = (callback: (path: string) => void): void => {
  const routerUnsubscribeMethod = internalRouter.subscribe((data: InsomniaRouterEvent) => {
    if (!isCurrentConnectionStillActive()) {
      routerUnsubscribeMethod()
      return
    }

    if (data.historyAction === 'PUSH') callback(data.location?.pathname)
  })
}
