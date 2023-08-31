/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from 'react'
import { TabData } from './tabs-panel.types'

export const useTabsPanel = () => {
  const tabDataRef = useRef<TabData[]>([])
  const [tabs, _setTabs] = useState<TabData[]>([])

  useEffect(() => {
    tabDataRef.current = tabs
  }, [tabs])

  const setTabs = (x: TabData[]) => {
    _setTabs(x)
  }

  return {
    tabs,
    setTabs,
    tabDataRef,
  }
}
