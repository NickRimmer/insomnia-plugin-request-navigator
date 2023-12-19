import { InsomniaRouter, InsomniaRouterEvent } from '../types'
import { isCurrentConnectionStillActive } from './refs-common'

let internalRouter: InsomniaRouter = {} as InsomniaRouter

// A delay is needed to wait for the router to be initialized, this is a
// workaround for the fact that the router is not available immediately after
// the plugin is loaded.
const ROUTER_INIT_DELAY = 1000;

export const initRouter = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rootElement = document.querySelector('#root') as any
      if (!rootElement) {
        console.error('[plugin-navigator]', 'root element not found')
        return resolve(false)
      }

      const containerElement = Object.getOwnPropertyNames(rootElement).findLast(
        (x) => x.startsWith('__reactContainer')
      );
      if (!containerElement) {
        console.warn('[plugin-navigator]', 'store container element not found')
        return resolve(false)
      }

      const memoizedStateElement =
        rootElement[containerElement].memoizedState.element;
      if (!memoizedStateElement) {
        console.warn('[plugin-navigator]', 'memoized state element not found')
        return resolve(false)
      }

      internalRouter = memoizedStateElement.props.router;
      return resolve(true)
    }, ROUTER_INIT_DELAY)
  });
};

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
