import { useEffect, useRef, useState } from 'react'
import { isCurrentConnectionStillActive } from '../../services/insomnia/connector/refs-common'
import { TabData, UseTabsPanelData } from './tabs-panel.types'
import { onRequestSelected } from '../../services/insomnia/events/request-selected'
import { onRequestUpdated } from '../../services/insomnia/events/request-updated'
import { onRouteChanged } from '../../services/insomnia/events/route-changed'
import { getAllRequests } from '../../services/insomnia/connector'
import { navigateToRequest } from '../../services/insomnia/navigator'
import React from 'react'

export const useTabsPanel = (id: string): UseTabsPanelData => {
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

  // when screen size changed
  useEffect(() => {
    const handleResize = () => {
      if (!isCurrentConnectionStillActive()) {
        window.removeEventListener('resize', handleResize)
        return
      }
      setScreenSize(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
  }, [])

  // when request selected - add or activate tab
  useEffect(() => {
    onRequestSelected((doc) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestId = (doc as any).activeRequestId
      if (!requestId) {
        console.warn('onRequestSelected', 'unexpected doc, activeRequestId not found', doc)
        return
      }

      if (!tabDataRef.current.find(tab => tab.requestId == requestId)) {
        const requestInfo = getAllRequests()[requestId]
        const tabData = { isActive: true, requestId, title: requestInfo.name }
        tabDataRef.current.forEach((x) => x.isActive = false)
        setTabs([...tabDataRef.current, tabData])
      } else {
        tabDataRef.current.forEach((x) => x.isActive = x.requestId == requestId)
        setTabs([...tabDataRef.current])
      }
    })

    // reset tabs on route change
    onRouteChanged(() => setTabs([]))
  }, [])

  // when request renamed - renamed tab
  useEffect(() => {
    onRequestUpdated((doc) => {
      const requestId = doc._id
      if (!requestId) {
        console.warn('onRequestUpdated', 'unexpected doc, activeRequestId not found', doc)
        return
      }

      const updatedList = [...tabDataRef.current]
      const tab = updatedList.find(tab => tab.requestId == requestId)
      if (!tab) return

      if (tab.title == doc.name) return
      tab.title = doc.name
      setTabs(updatedList)
    })

    // reset tabs on route change
    onRouteChanged(() => setTabs([]))
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
      console.error('[plugin-navigator]', `parent with id '${id}' not found`)
      return
    }

    const children = parent?.querySelectorAll('.tab-button')
    if (!children) return

    const parentRightBound = parent.getBoundingClientRect().right
    if (!parentRightBound) return

    const tabsToCollapse: TabData[] = []
    children.forEach((element) => {
      if (element.getBoundingClientRect().right > parentRightBound) {
        element.classList.add('hidden')
        tabsToCollapse.push({ title: element.getAttribute('data-title'), requestId: element.getAttribute('data-request-id'), isActive: element.classList.contains('active') } as TabData)
      } else {
        element.classList.remove('hidden')
      }
    })

    setCollapsedTabs(tabsToCollapse)
  }, [tabs, screenSize])

  const onTabClick = (requestId: string): void => {
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

  const onCloseClick = (requestId: string): void => {
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
    onTabClick,
    onCloseClick,
  }
}
