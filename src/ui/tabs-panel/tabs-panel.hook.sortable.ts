import { TabData } from './tabs-panel.types'

export const useSortable = ({ tabs, setTabs }: { tabs: TabData[], setTabs: (tabs: TabData[]) => void }) => {
  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }): void => {
    // move tab from old index to new index
    const element = tabs.splice(oldIndex, 1)[0]
    tabs.splice(newIndex, 0, element)
    setTabs([...tabs])
  }

  return {
    onSortEnd,
  }
}
