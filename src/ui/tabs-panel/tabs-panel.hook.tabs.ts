import { TabData } from './tabs-panel.types'
import { navigateToRequest } from '../../services/insomnia/navigator'

export const useTabs = ({ tabs, setTabs }: { tabs: TabData[], setTabs: (tabs: TabData[]) => void }) => {

  const onTabClicked = (requestId: string): void => {
    const tabData = tabs.find(tab => tab.requestId == requestId)
    if (!tabData) {
      console.warn('tab not found', requestId)
      return
    }

    if (tabData.isActive) return
    tabs.forEach((x) => x.isActive = x === tabData)
    setTabs([...tabs])
    showTabContent(tabData.requestId)
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
      showTabContent(updated[activeTabIndex].requestId)
    }

    setTabs(updated)
  }

  const showTabContent = (requestId: string): void => {
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
    onTabClicked,
    onCloseClicked,
    showTabContent,
  }
}
