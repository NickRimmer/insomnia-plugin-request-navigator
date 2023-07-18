import React, { FC, useEffect } from 'react'
import './tabs-panel.styles.scss'
import { TabButton } from '../tab-button'
import { useTabsPanel } from './tabs-panel.hook'
import { TabDropdown } from '../tab-dropdown'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { TabData } from './tabs-panel.types'
import { useSortable } from './tabs-panel.hook.sortable'
import { useContextMenu } from './tabs-panel.hook.contextmenu'
import { useDropdown } from './tabs-panel.hook.dropdown'
import { useRequestHandlers } from './tabs-panel.hook.request'
import { useTabs } from './tabs-panel.hook.tabs'

const id = Math.random().toString(36).substring(2)
export const TabsPanel: FC = () => {
  const {
    tabs,
    setTabs,
    tabDataRef,
  } = useTabsPanel()

  const { onSortEnd } = useSortable({ tabs, setTabs })
  const { collapsedTabs } = useDropdown({ tabs, id })
  const { onCloseClicked, onTabClicked, showTabContent } = useTabs({ tabs, setTabs })
  const { onClickCloseAll, onClickCloseOnRight, onCloseOthersClicked } = useContextMenu({ tabs, setTabs, showTabContent })

  useRequestHandlers({ setTabs, tabDataRef })

  useEffect(() => {
    if (tabs.length > 0) {
      const activeTab = tabs.find(x => x.isActive)
      if (activeTab) showTabContent(activeTab.requestId)
    }
  }, [])

  const SortableItem = SortableElement(({ tab }: { tab: TabData }) => <TabButton
    onClickButton={() => onTabClicked(tab.requestId)}
    onClickClose={() => onCloseClicked(tab.requestId)}
    onClickCloseOthers={() => onCloseOthersClicked(tab.requestId)}
    onClickCloseOnRight={() => onClickCloseOnRight(tab.requestId)}
    onClickCloseAll={() => onClickCloseAll()}
    isHidden={collapsedTabs.findIndex(x => x.requestId === tab.requestId) !== -1 ? true : false}
    {...tab}
  >{tab.title}</TabButton>)

  const SortableList = SortableContainer(({ items }: { items: TabData[] }) => {
    return (
      <div className='items'>
        {items.map((value, index) => (
          <SortableItem key={`item-${value.requestId}`} index={index} tab={value} />
        ))}
      </div>
    )
  })

  return (
    <div className={`tabs-panel ${!tabs?.length ? 'hidden' : ''}`} id={id}>
      <SortableList items={tabs} lockAxis='x' axis='x' onSortEnd={onSortEnd} distance={10} />
      <div className='dropdown'>
        <TabDropdown tabs={collapsedTabs} onMenuClicked={onTabClicked} onCloseClicked={onCloseClicked} />
      </div>
    </div>
  )
}
