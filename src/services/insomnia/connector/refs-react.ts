/* eslint-disable @typescript-eslint/no-explicit-any */
import { isCurrentConnectionStillActive } from './refs-common'

export type ReactRefs = {
  //TODO add types
  store: any;
  router: any;
}

export const getReactRefs = (): ReactRefs | null => {
  const rootElement = document.querySelector('#root') as any
  if (!rootElement) {
    console.error('[plugin-navigator]', 'root element not found')
    return null
  }

  const containerElement = Object.getOwnPropertyNames(rootElement).findLast(x => x.startsWith('__reactContainer'))
  if (!containerElement) {
    console.error('[plugin-navigator]', 'store container element not found')
    return null
  }

  return {
    store: rootElement[containerElement].memoizedState.element.props.store,
    router: rootElement[containerElement].memoizedState.element.props.children.props.router
  }
}

export const subscribeForRoutePushed = (router: any, callback: (path: string) => void): void => {
  const routerUnsubscribeMethod = router.subscribe((data: any) => {
    if (!isCurrentConnectionStillActive()) {
      routerUnsubscribeMethod()
      return
    }
    if (data.historyAction === 'PUSH') callback(data.location?.pathname)
  })
}
