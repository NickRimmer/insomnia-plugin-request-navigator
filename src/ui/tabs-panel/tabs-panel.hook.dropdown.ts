import React, { useEffect } from 'react'
import { isCurrentConnectionStillActive } from '../../services/insomnia/connector/refs-common'
import { TabData } from './tabs-panel.types'

export const useDropdown = ({ tabs, id }: { tabs: TabData[], id: string }) => {
  const [screenSize, setScreenSize] = React.useState<number>(0)
  const [collapsedTabs, setCollapsedTabs] = React.useState<TabData[]>([])

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

  return {
    collapsedTabs,
  }
}
