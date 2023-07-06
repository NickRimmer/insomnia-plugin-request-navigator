import React, { FC } from 'react'
import './tabs-panel.styles.scss'
import { TabButton } from '../tab-button'
import { useTabsPanel } from './tabs-panel.hook'
import { TabDropdown } from '../tab-dropdown'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { TabData } from './tabs-panel.types'

const id = Math.random().toString(36).substring(2)
export const TabsPanel: FC = () => {
  const {
    tabs,
    collapsedTabs,
    onTabClicked,
    onCloseClicked,
    onSortEnd,
  } = useTabsPanel(id)

  const SortableItem = SortableElement(({ tab }: { tab: TabData }) => <TabButton
    onClickButton={() => onTabClicked(tab.requestId)}
    onClickClose={() => onCloseClicked(tab.requestId)}
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
