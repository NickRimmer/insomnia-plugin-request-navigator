import { getStore } from '../connector'

export const navigateToRequest = (requestId: string): boolean => {
  const store = getStore()

  // get active workspace
  const state = store.getState()
  const workspaceId = state.global.activeWorkspaceId
  if (!workspaceId) {
    console.warn('[plugin-navigator]', 'workspace id not found')
    return false
  }

  // to make sure we do not set not existing request as active
  const request = state.entities.requests[requestId] ?? state.entities.grpcRequests[requestId]
  if (!request) {
    console.warn('[plugin-navigator]', 'request not found', requestId)
    return false
  }

  // find workspace meta by workspace id
  let workspaceMeta = null
  for (const x in state.entities.workspaceMetas)
    if (state.entities.workspaceMetas[x].parentId === workspaceId)
      workspaceMeta = state.entities.workspaceMetas[x]

  if (!workspaceMeta) {
    console.warn('[plugin-navigator]', 'workspace meta not found', workspaceId)
    return false
  }

  // update active request in workspace meta
  workspaceMeta.activeRequestId = requestId
  workspaceMeta.modified = Date.now()

  // push updated workspace meta to store
  const update = {
    type: 'entities/changes',
    changes: [
      [
        'update',
        { ...workspaceMeta },
        false
      ]
    ]
  }
  store.dispatch(update)

  return true
}
