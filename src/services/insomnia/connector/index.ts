/* eslint-disable @typescript-eslint/no-explicit-any */
import { getReactRefs, subscribeForRoutePushed } from './refs-react'
import { subscibeForDbChangeEvents } from './refs-events'
import { DocBaseModel } from '../types'
import { notifyRequestSelected } from '../events/request-selected'
import { notifyRequestUpdated } from '../events/request-updated'
import { notifyRequestDeleted } from '../events/request-deleted'
import { notifyRouteChanged } from '../events/route-changed'
import { initConnection } from './refs-common'

export const connect = (): boolean => {
  console.log('[plugin-navigator]', 'connecting to insomnia')
  initConnection()

  // get react references
  const reactRefs = getReactRefs()
  if (!reactRefs) {
    console.warn('[plugin-navigator]', 'react resources not found')
    return false
  }

  stateInternal = reactRefs.state
  routerInternal = reactRefs.router

  window.dev = { ...window.dev, stateInternal }
  window.dev = { ...window.dev, routerInternal }

  // connect to router
  subscribeForRoutePushed(routerInternal, (path: string) => notifyRouteChanged(path))

  // connect to db changes
  subscibeForDbChangeEvents((doc, method) => {
    if (method === 'update' && doc.type === 'WorkspaceMeta') notifyRequestSelected(doc)
    if (method === 'update' && (doc.type === 'Request' || doc.type === 'GrpcRequest')) notifyRequestUpdated(doc)
    if (method === 'remove' && (doc.type === 'Request' || doc.type === 'GrpcRequest')) notifyRequestDeleted(doc)
  })

  return true
}

// react store
let stateInternal: any = {}
export const getState = (): any => stateInternal
export const getAllRequests = (): Record<string, DocBaseModel> => {
  const requests = []
  const workspaceData = getState()[':workspaceId']

  requests.push(...workspaceData.collection.map((x: { doc: any }) => x.doc).filter((x: { type: string }) => x.type === 'Request'))
  requests.push(...workspaceData.grpcRequests)

  const result: Record<string, DocBaseModel> = {}
  requests.forEach((x) => result[x._id] = x)

  return result
}

// react router
let routerInternal: any = {}
export const getRouter = (): any => routerInternal
