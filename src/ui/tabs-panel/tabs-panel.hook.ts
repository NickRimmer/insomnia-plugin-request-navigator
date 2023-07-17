/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { TabData } from './tabs-panel.types'
import { onRouteChanged } from '../../services/insomnia/events/route-changed'

export const useTabsPanel = () => {
  const tabDataRef = useRef<TabData[]>([])
  const [tabs, setTabs] = useState<TabData[]>([])

  // reset tabs on route change
  useEffect(() => {
    onRouteChanged(() => setTabs([]))
  }, [])

  // when tabs changed - update reference value
  useEffect(() => {
    tabDataRef.current = tabs
  }, [tabs])


  return {
    tabs,
    setTabs,
    tabDataRef,
  }
}
