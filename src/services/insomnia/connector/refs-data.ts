import { InsomniaDocBase, InsomniaRouter } from '../types'
import { getRouter } from './refs-router'

export const getData = (): InsomniaRouter['state']['loaderData'] => getRouter().state.loaderData
export const getAllRequests = (): InsomniaDocBase[] => getData()[':workspaceId']['collection'].map(x => x.doc)
export const getRequestOrUndefined = (requestId: string): InsomniaDocBase | undefined => getAllRequests().find(x => x._id === requestId)
export const getActiveRequest = (): InsomniaDocBase | undefined => getData()['request/:requestId']['activeRequest']
export const getActiveWorkspace = (): InsomniaDocBase | undefined => getData()[':workspaceId']['activeWorkspace']
export const getActiveProject = (): InsomniaDocBase | undefined => getData()[':workspaceId']['activeProject']
