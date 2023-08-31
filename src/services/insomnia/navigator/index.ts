import { getActiveProject, getActiveWorkspace } from '../connector/refs-data'
import { getRouter } from '../connector/refs-router'

export const navigateToRequest = (requestId: string): boolean => {
  const activeOrg = 'org_default-project' // TODO find from state
  const activeProject = getActiveProject()?._id
  const activeWorkspace = getActiveWorkspace()?._id

  if (!activeOrg || !activeProject || !activeWorkspace) {
    console.warn('[plugin-navigator]', 'cannot navigate to request', requestId, 'because active org, project or workspace not found')
    return false
  }

  const url = `/organization/${activeOrg}/project/${activeProject}/workspace/${activeWorkspace}/debug/request/${requestId}`
  getRouter().navigate(url)

  return true
}
