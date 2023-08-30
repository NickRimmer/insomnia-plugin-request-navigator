/* eslint-disable @typescript-eslint/no-explicit-any */
import { isCurrentConnectionStillActive } from './refs-common'

export type ReactRefs = {
  state: any;
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
    console.warn('[plugin-navigator]', 'store container element not found')
    return null
  }

  const state = rootElement[containerElement].memoizedState.element.props.router.state.loaderData
  // state.global.activeWorkspaceId
  Object.assign(state, { global: { activeWorkspaceId: state[':workspaceId'].activeWorkspace._id } })
  Object.assign(state, {
    entities: {
      requests: state[':workspaceId'].collection,
      grpcRequests: state[':workspaceId'].grpcRequests,
      workspaceMeta: state[':workspaceId'].activeWorkspaceMeta,
    }
  })

  return {
    state: rootElement[containerElement].memoizedState.element.props.router.state.loaderData,
    router: rootElement[containerElement].memoizedState.element.props.router
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
