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

  storeInternal = reactRefs.store
  routerInternal = reactRefs.router

  // connect to router
  subscribeForRoutePushed(routerInternal, (path: string) => notifyRouteChanged(path))

  // connect to db changes
  subscibeForDbChangeEvents((doc, method) => {
    if (method === 'update' && doc.type === 'WorkspaceMeta') notifyRequestSelected(doc)
    if (method === 'update' && doc.type === 'Request') notifyRequestUpdated(doc)
    if (method === 'remove' && doc.type === 'Request') notifyRequestDeleted(doc)
  })

  return true
}

// react store
let storeInternal: any = {}
export const getStore = (): any => storeInternal
export const getState = (): any => storeInternal.getState().entities
export const getAllRequests = (): DocBaseModel[] => getState().requests

// react router
let routerInternal: any = {}
export const getRouter = (): any => routerInternal
