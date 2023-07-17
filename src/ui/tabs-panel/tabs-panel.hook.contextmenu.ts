import { TabData } from './tabs-panel.types'

export const useContextMenu = ({ tabs, setTabs, showTabContent }: {
  tabs: TabData[],
  setTabs: (tabs: TabData[]) => void,
  showTabContent: (requestId: string) => void,
}) => {

  const onCloseOthersClicked = (requestId: string): void => {
    const tabData = tabs.find(tab => tab.requestId == requestId)
    if (!tabData) {
      console.error('tab not found', requestId)
      return
    }

    tabData.isActive = true
    const updated = tabs.filter((tab) => tab.requestId === tabData.requestId)
    setTabs(updated)
    showTabContent(tabData.requestId)
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
    showTabContent(tabData.requestId)
  }

  const onClickCloseAll = (): void => {
    setTabs([])
  }

  return {
    onCloseOthersClicked,
    onClickCloseOnRight,
    onClickCloseAll,
  }
}
