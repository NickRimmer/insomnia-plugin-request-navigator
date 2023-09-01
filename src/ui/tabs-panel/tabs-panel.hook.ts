/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from 'react'
import { TabData } from './tabs-panel.types'
import { Workspace, database } from '../../services/db'
import { getActiveWorkspace, getAllRequests, getAllWorkspaces } from '../../services/insomnia/connector/refs-data'
import { onDebugPageOpenChanged } from '../../services/insomnia/events/debug-page-opened'
import { getRequestMethodName } from '../../services/helpers'

export const useTabsPanel = () => {
  const tabDataRef = useRef<TabData[]>([])
  const [tabs, _setTabs] = useState<TabData[]>([])
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const unSubonDebugPageOpenChanged = onDebugPageOpenChanged(opened => {
      if (opened) {
        setActiveWorkspaceId(getActiveWorkspace()?._id)
      } else {
        setActiveWorkspaceId(undefined)
        tryToCleanupDb()
      }
    })

    // when first load
    setActiveWorkspaceId(getActiveWorkspace()?._id)

    return () => {
      unSubonDebugPageOpenChanged()
    }
  }, [])

  // when workspace opened
  useEffect(() => {
    if (!activeWorkspaceId) {
      _setTabs([])
      return
    }

    database.findOne({ workspaceId: activeWorkspaceId }, (err: any, doc: Workspace | undefined) => {
      if (err) {
        console.error('[plugin-navigator]', 'cannot get workspace data from db', err)
        return
      }

      const allRequests = getAllRequests()
      const loadedTabs: TabData[] = doc?.tabs.map(x => {
        const request = allRequests.find(y => y._id === x.requestId)
        if (!request) return null
        const result: TabData = ({
          requestId: request._id,
          title: request.name,
          isActive: x.isActive ?? false,
          method: getRequestMethodName(request)
        })

        return result
      }).filter(x => x) as TabData[] || []

      setTabs(loadedTabs)
    })
  }, [activeWorkspaceId])

  // update ref on tabs change
  useEffect(() => {
    tabDataRef.current = tabs
  }, [tabs])

  // set tabs and save to db
  const setTabs = (x: TabData[]) => {
    const currentWorkspaceId = getActiveWorkspace()?._id
    if (!currentWorkspaceId) {
      console.warn('[plugin-navigator]', 'cannot get current workspace id')
      return
    }

    database.findOne({ workspaceId: currentWorkspaceId }, (err: any, doc: Workspace | undefined) => {
      if (err) {
        console.error('[plugin-navigator]', 'cannot get workspace data from db', err)
        return
      }

      doc = doc || { workspaceId: currentWorkspaceId, tabs: [] }
      doc.tabs = x.map((tab, index) => ({ requestId: tab.requestId, index: index, isActive: tab.isActive }))

      database.update({ workspaceId: currentWorkspaceId }, doc, { upsert: true }, (err: any) => {
        if (err) console.error('[plugin-navigator]', 'cannot update workspace data in db', err)
      })
    })
    _setTabs(x)
  }

  return {
    tabs,
    setTabs,
    tabDataRef,
  }
}

const tryToCleanupDb = () => {
  const allWorkspaces = getAllWorkspaces()
  if (!allWorkspaces) return

  try {
    const existsWorkspaces = allWorkspaces.map(x => x._id)
    const storedWorkspaces = database.getAllData()
    const removeWorkspaces = storedWorkspaces.filter(x => !existsWorkspaces.includes(x.workspaceId))
    removeWorkspaces.map(x => database.remove(x, err => {
      if (err) console.error('[plugin-navigator]', 'cleanupWorkspaces error', err)
    }))
  } catch (err) {
    console.error('[plugin-navigator]', 'cleanupWorkspaces', err)
  }
}
