/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import { TabData } from './tabs-panel.types'
import { onRouteChanged } from '../../services/insomnia/events/route-changed'
import { database, Workspace, WorkspaceTab } from '../../services/db'
import { getAllRequests, getRouter, getState } from '../../services/insomnia/connector'
import { getRequestMethodName } from '../../services/helpers'

const isRouteDebugView = (route: string) => /\/organization\/org_[^/]+\/project\/proj_[^/]+\/workspace\/wrk_[^/]+\/debug/gm.test(route)

export const useTabsPanel = () => {
  const tabDataRef = useRef<TabData[]>([])
  const [tabs, _setTabs] = useState<TabData[]>([])

  // reset tabs on route change
  useEffect(() => {
    onRouteChanged(route => {
      if (isRouteDebugView(route)) requestChanged()
      else if (tabDataRef.current.length > 0) {
        _setTabs([])
      }
    })

    if (isRouteDebugView(getRouter().state.location.pathname))
      requestChanged()
  }, [])

  useEffect(() => {
    tabDataRef.current = tabs
  }, [tabs])

  const requestChanged = () => {
    const state = getState()
    const workspaceId = state.global.activeWorkspaceId

    database.findOne<Workspace>({ workspaceId }, (err, storeWorkspace) => {
      if (err) {
        // if not able to load workspace tabs
        console.error('[plugin-navigator]', 'error loading workspace tabs', err)
        _setTabs([])
      } else if (!storeWorkspace || storeWorkspace.tabs.length === 0) {
        // if no saved tabs for workspace
        _setTabs([])
      } else {
        // try to restore saved tabs
        const allRequests = getAllRequests()

        const loadedTabs = storeWorkspace
          .tabs // all saved tabs for workspace
          .map(x => ({ entity: x, doc: allRequests[x.requestId] })) // try to find request by id
          .filter(x => x.doc) // filter out not found requests
          .map<TabData>(x => { // map to tab data
            const method = getRequestMethodName(x.doc)
            return ({ requestId: x.doc._id, isActive: x.entity.isActive ?? false, method, title: x.doc.name })
          }) || [] as TabData[]

        // fix active tab
        if (loadedTabs.length > 0 && loadedTabs.filter(x => x.isActive).length === 0) loadedTabs[0].isActive = true
        setTabs(loadedTabs)
      }
    })
  }

  const setTabs = (tabs: TabData[]) => {
    const state = getState()
    const workspaceId = state.global.activeWorkspaceId

    const workspaceTabs: Workspace = {
      workspaceId,
      tabs: tabs.map((tab, index) => {
        const workspaceTab: WorkspaceTab = {
          requestId: tab.requestId,
          index: index,
          isActive: tab.isActive,
        }
        return workspaceTab
      }),
    }

    database.update<Workspace>({ workspaceId }, workspaceTabs, { upsert: true }, (err) => {
      if (err) console.error('[plugin-navigator]', 'error saving workspace tabs', err)
    })

    _setTabs(tabs)
  }

  return {
    tabs,
    setTabs,
    tabDataRef,
  }
}
