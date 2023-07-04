import React, { FC } from 'react'
import './tabs-panel.styles.scss'
import { TabButton } from '../tab-button'
import { useTabsPanel } from './tabs-panel.hook'
import { TabDropdown } from '../tab-dropdown'

const id = Math.random().toString(36).substring(2)
export const TabsPanel: FC = () => {
  const {
    tabs,
    collapsedTabs,
    onTabClick: onTabClicked,
    onCloseClick: onCloseClicked,
  } = useTabsPanel(id)

  return (
    <div className={`tabs-panel ${!tabs?.length ? 'hidden' : ''}`} id={id}>
      <div className='items'>
        {tabs.map((tab) => (<TabButton
          key={tab.requestId}
          onClickButton={() => onTabClicked(tab.requestId)}
          onClickClose={() => onCloseClicked(tab.requestId)}
          {...tab}
        >{tab.title}</TabButton>))}
      </div>
      <div className='dropdown'>
        <TabDropdown tabs={collapsedTabs} onMenuClicked={onTabClicked} onCloseClicked={onCloseClicked} />
      </div>
    </div>
  )
}
