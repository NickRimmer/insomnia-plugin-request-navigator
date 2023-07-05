/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocBaseModel } from '../types'
import { isCurrentConnectionStillActive } from './refs-common'

export const subscibeForEvents = (channelName: string, callback: (data: any) => void): void => {
  const unsubscribeMethod = (window as any).main.on(channelName, (_: never, data: any) => {
    if (!isCurrentConnectionStillActive()) {
      unsubscribeMethod()
      return
    }

    callback(data)
  })
}

export const subscibeForDbChangeEvents = (callback: (data: DocBaseModel, method: string) => void): void => {
  subscibeForEvents('db.changes', (changes: any[][]) => changes.forEach((data) => {
    // console.log('[plugin-navigator]', 'db.changes', data)

    if (data.length != 3) {
      console.warn('[plugin-navigator]', 'unexpected data recevied in db.changes channel', data)
      return
    }

    const method = data[0]
    const doc = data[1] as DocBaseModel

    if (!method || !doc) {
      console.warn('[plugin-navigator]', 'unexpected method or doc recevied in db.changes channel', data)
      return
    }

    // console.log('[plugin-navigator]', 'db.changes', method, doc)
    callback(doc, method)
  }))
}
