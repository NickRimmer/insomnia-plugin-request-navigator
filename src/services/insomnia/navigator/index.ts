import { getAllRequests, getState, getRouter } from '../connector'

export const navigateToRequest = (requestId: string): boolean => {
  // get active workspace
  const state = getState()
  const workspaceId = state.global.activeWorkspaceId
  if (!workspaceId) {
    console.warn('[plugin-navigator]', 'workspace id not found')
    return false
  }

  // to make sure we do not set not existing request as active
  const request = getAllRequests()[requestId]
  if (!request) {
    console.warn('[plugin-navigator]', 'request not found', requestId)
    return false
  }

  // find workspace meta by workspace id
  const workspaceMeta = state.entities.workspaceMeta
  if (!workspaceMeta) {
    console.warn('[plugin-navigator]', 'workspace meta not found', workspaceId)
    return false
  }

  // update active request in workspace meta
  // workspaceMeta.activeRequestId = requestId
  // workspaceMeta.modified = Date.now()

  // // push updated workspace meta to store
  // const update = {
  //   type: 'entities/changes',
  //   changes: [
  //     [
  //       'update',
  //       { ...workspaceMeta },
  //       false
  //     ]
  //   ]
  // }

  const activeOrg = 'org_default-project' // TODO find from state
  const activeProject = state[':workspaceId'].activeProject._id
  const activeWorkspace = state[':workspaceId'].activeWorkspace._id

  const url = `/organization/${activeOrg}/project/${activeProject}/workspace/${activeWorkspace}/debug/request/${requestId}`
  getRouter().navigate(url)

  // throw new Error('Not implemented')
  // store.dispatch(update)

  return true
}
