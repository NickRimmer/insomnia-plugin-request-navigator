/* eslint-disable @typescript-eslint/no-explicit-any */
import { notifyRequestDeleted } from '../events/request-deleted'
import { notifyRequestUpdated } from '../events/request-updated'
import { InsomniaDocBase } from '../types'
import { isCurrentConnectionStillActive } from './refs-common'
import { subscribeForRouteChanged } from './refs-router'
import { getRequestOrUndefined } from './refs-data'
import { notifyRequestSelected } from '../events/request-selected'
import { notifyDebugPageOpenChanged } from '../events/debug-page-opened'

export const initEvents = (): void => {
  subscibeForDbChangeEvents((doc, method) => {
    if (method === 'update' && (doc.type === 'Request' || doc.type === 'GrpcRequest')) notifyRequestUpdated(doc)
    if (method === 'remove' && (doc.type === 'Request' || doc.type === 'GrpcRequest')) notifyRequestDeleted(doc)
  })

  subscribeForRouteChanged((path: string) => {
    if (isRouteDebugView(path)) {
      notifyDebugPageOpenChanged(true)
      const requestId = extractRequestId(path)
      if (!requestId) {
        console.warn('[plugin-navigator]', 'cannot extract request id from router path', path)
        return
      }

      const doc = getRequestOrUndefined(requestId)
      if (!doc) {
        console.warn('[plugin-navigator]', 'request not found', requestId)
        return
      }

      notifyRequestSelected(doc)
    } else {
      notifyDebugPageOpenChanged(false)
    }
  })

  console.log('[plugin-navigator]', 'events initialized')
}

const subscibeForDbChangeEvents = (callback: (data: InsomniaDocBase, method: string) => void): void => {
  subscribeForChannelEvents('db.changes', (changes: any[][]) => changes.forEach((data) => {
    if (data.length != 3) {
      console.warn('[plugin-navigator]', 'unexpected data recevied in db.changes channel', data)
      return
    }

    const method = data[0]
    const doc = data[1] as InsomniaDocBase

    if (!method || !doc) {
      console.warn('[plugin-navigator]', 'unexpected method or doc recevied in db.changes channel', data)
      return
    }

    callback(doc, method)
  }))
}

const subscribeForChannelEvents = (channelName: string, callback: (data: any) => void): void => {
  const unsubscribeMethod = (window as any).main.on(channelName, (_: never, data: any) => {
    if (!isCurrentConnectionStillActive()) {
      unsubscribeMethod()
      return
    }

    callback(data)
  })
}

const isRouteDebugView = (route: string) => /\/organization\/org_[^/]+\/project\/proj_[^/]+\/workspace\/wrk_[^/]+\/debug/.test(route)
const extractRequestId = (route: string) => route.match(/\/((req_|greq_)[0-9a-z]+)$/)?.[1]
