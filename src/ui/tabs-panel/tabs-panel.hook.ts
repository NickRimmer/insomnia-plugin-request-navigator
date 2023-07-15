/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { isCurrentConnectionStillActive } from '../../services/insomnia/connector/refs-common'
import { TabData } from './tabs-panel.types'
import { onRequestSelected } from '../../services/insomnia/events/request-selected'
import { onRequestUpdated } from '../../services/insomnia/events/request-updated'
import { onRequestDeleted } from '../../services/insomnia/events/request-deleted'
import { onRouteChanged } from '../../services/insomnia/events/route-changed'
import { getAllRequests } from '../../services/insomnia/connector'
import { navigateToRequest } from '../../services/insomnia/navigator'
import React from 'react'

export const useTabsPanel = (id: string)/*: UseTabsPanelData*/ => {
  const tabDataRef = useRef<TabData[]>([])
  const [tabs, setTabs] = useState<TabData[]>([
    // { title: 'Request 0', requestId: 'req_0', isActive: true },
    // { title: 'Request 1', requestId: 'req_1', isActive: false },
    // { title: 'Request 2', requestId: 'req_2', isActive: false },
    // { title: 'Request 3', requestId: 'req_3', isActive: false },
    // { title: 'Request 4', requestId: 'req_4', isActive: false },
    // { title: 'Request 5', requestId: 'req_5', isActive: false },
    // { title: 'Request 6', requestId: 'req_6', isActive: false },
    // { title: 'Request 7', requestId: 'req_7', isActive: false },
    // { title: 'Request 8', requestId: 'req_8', isActive: false },
    // { title: 'Request 9', requestId: 'req_9', isActive: false },
  ])
  const [screenSize, setScreenSize] = React.useState<number>(0)
  const [collapsedTabs, setCollapsedTabs] = React.useState<TabData[]>([])

  // initialize tabs
  useEffect(() => {
    const handleResize = () => {
      if (!isCurrentConnectionStillActive()) {
        window.removeEventListener('resize', handleResize)
        return
      }
      setScreenSize(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)

    // reset tabs on route change
    onRouteChanged(() => setTabs([]))
  }, [])

  // when request selected - add or activate tab
  useEffect(() => {
    onRequestSelected((doc) => {
      const requestId = (doc as any).activeRequestId
      if (!requestId) {
        console.warn('onRequestSelected', 'unexpected doc, activeRequestId not found', doc)
        return
      }

      if (!tabDataRef.current.find(tab => tab.requestId == requestId)) {
        const requestInfo = getAllRequests()[requestId]

        let method = (requestInfo as any).method
        if (!method && requestInfo._id.startsWith('greq_')) method = 'gRPC'

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

  // when tabs changed - update reference value
  useEffect(() => {
    tabDataRef.current = tabs
  }, [tabs])

  // when tabs changed or screen size updated - update dropdown view
  useEffect(() => {
    const root = document.getElementById(id)
    const parent = root?.querySelector('.items')
    if (!parent) {
      return
    }

    const children = parent.querySelectorAll('.plugin-request-navigator-tab-button')
    if (!children?.length) {
      return
    }

    const parentRightBound = parent.getBoundingClientRect().right
    if (!parentRightBound) {
      console.error('[plugin-navigator]', 'parent has no right bound')
      return
    }

    const tabsToCollapse: TabData[] = []
    children.forEach((element) => {
      if (element.getBoundingClientRect().right > parentRightBound) {
        tabsToCollapse.push({
          method: element.getAttribute('data-method'),
          title: element.getAttribute('data-title'),
          requestId: element.getAttribute('data-request-id'),
          isActive: element.classList.contains('active')
        } as TabData)
      }
    })

    setCollapsedTabs(tabsToCollapse)
  }, [tabs, screenSize])

  const onTabClicked = (requestId: string): void => {
    const tabData = tabs.find(tab => tab.requestId == requestId)
    if (!tabData) {
      console.warn('tab not found', requestId)
      return
    }

    if (tabData.isActive) return
    tabs.forEach((x) => x.isActive = x === tabData)
    setTabs([...tabs])
    showTab(tabData.requestId)
  }

  const onCloseClicked = (requestId: string): void => {
    const tabData = tabs.find(tab => tab.requestId == requestId)
    if (!tabData) {
      console.warn('tab not found', requestId)
      return
    }

    const updated = tabs.filter((tab) => tab.requestId !== tabData.requestId)
    if (tabData.isActive && updated.length) {
      const closedTabIndex = tabs.findIndex((tab) => tab.requestId === tabData.requestId)

      // set next tab as active
      const activeTabIndex = Math.min(updated.length - 1, closedTabIndex)
      updated[activeTabIndex].isActive = true
      showTab(updated[activeTabIndex].requestId)
    }

    setTabs(updated)
  }

  const onCloseOthersClicked = (requestId: string): void => {
    const tabData = tabs.find(tab => tab.requestId == requestId)
    if (!tabData) {
      console.error('tab not found', requestId)
      return
    }

    tabData.isActive = true
    const updated = tabs.filter((tab) => tab.requestId === tabData.requestId)
    setTabs(updated)
    showTab(tabData.requestId)
  }

  const onClickCloseOnRight = (requestId: string): void => {
    const tabData = tabs.find(tab => tab.requestId == requestId)
    if (!tabData) {
      console.error('tab not found', requestId)
      return
    }

    const closedTabIndex = tabs.findIndex((tab) => tab.requestId === tabData.requestId)
    const updated = tabs.slice(0, closedTabIndex + 1)

    const currentActive = updated.findIndex((tab) => tab.isActive)
    if (currentActive == -1) tabData.isActive = true

    setTabs(updated)
    showTab(tabData.requestId)
  }

  const onClickCloseAll = (): void => {
    setTabs([])
  }

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }): void => {
    // move tab from old index to new index
    const element = tabs.splice(oldIndex, 1)[0]
    tabs.splice(newIndex, 0, element)
    setTabs([...tabs])
  }

  const showTab = (requestId: string): void => {
    const tabData = tabs.find(tab => tab.requestId == requestId)
    if (!tabData) {
      console.warn('tab not found', requestId)
      return
    }

    // navigate to request
    const navigated = navigateToRequest(requestId)
    if (!navigated) {
      //TODO disable tab as broken
    }
  }

  return {
    tabs,
    collapsedTabs,
    onTabClicked,
    onCloseClicked,
    onCloseOthersClicked,
    onClickCloseOnRight,
    onClickCloseAll,
    onSortEnd,
  }
}
