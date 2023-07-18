import { database } from './db'
import { getState } from '../insomnia/connector/index'

export const cleanupWorkspacesAsync = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existsWorkspaces = Object.values(getState().workspaces).map((x: any) => x._id)
    const storedWorkspaces = await database.getAllData()
    const removeWorkspaces = storedWorkspaces.filter(x => !existsWorkspaces.includes(x.workspaceId))
    await Promise.all(removeWorkspaces.map(x => database.remove(x)))
  } catch (err) {
    console.error('[plugin-navigator]', 'cleanupWorkspaces', err)
  }
}
