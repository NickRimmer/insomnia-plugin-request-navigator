/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutableRefObject, useEffect } from 'react'
import { TabData } from './tabs-panel.types'
import { onRequestSelected } from '../../services/insomnia/events/request-selected'
import { onRequestUpdated } from '../../services/insomnia/events/request-updated'
import { onRequestDeleted } from '../../services/insomnia/events/request-deleted'
import { getAllRequests } from '../../services/insomnia/connector'
import { getRequestMethodName } from '../../services/helpers'

export const useRequestHandlers = ({ setTabs, tabDataRef }: { setTabs: (tabs: TabData[]) => void, tabDataRef: MutableRefObject<TabData[]> }) => {
  // when request selected - add or activate tab
  useEffect(() => {
    onRequestSelected((doc) => {
      const requestId = (doc as any).activeRequestId
      if (!requestId) {
        console.warn('[plugin-navigator]', 'onRequestSelected', 'unexpected doc, activeRequestId not found', doc)
        return
      }

      if (!tabDataRef.current.find(tab => tab.requestId == requestId)) {
        const requestInfo = getAllRequests()[requestId]
        const method = getRequestMethodName(requestInfo)
        const tabData = { isActive: true, requestId, title: requestInfo.name, method }
        tabDataRef.current.forEach((x) => x.isActive = false)
        setTabs([...tabDataRef.current, tabData])
      } else {
        tabDataRef.current.forEach((x) => x.isActive = x.requestId == requestId)
        setTabs([...tabDataRef.current])
      }
    })
  }, [])

  // when request renamed - renamed tab
  useEffect(() => {
    onRequestUpdated((doc) => {
      const requestId = doc._id
      if (!requestId) {
        console.warn('onRequestUpdated', 'unexpected doc, request id not found', doc)
        return
      }

      const updatedList = [...tabDataRef.current]
      const tab = updatedList.find(tab => tab.requestId == requestId)
      if (!tab) return

      if (tab.title == doc.name) return
      tab.title = doc.name
      setTabs(updatedList)
    })
  }, [])

  // when request removed - remove tab
  useEffect(() => {
    onRequestDeleted((doc) => {
      const requestId = doc._id
      if (!requestId) {
        console.warn('onRequestUpdated', 'unexpected doc, request id not found', doc)
        return
      }

      const updatedList = [...tabDataRef.current].filter(tab => tab.requestId != requestId)
      setTabs(updatedList)
    })
  }, [])
}
