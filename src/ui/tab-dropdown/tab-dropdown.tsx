import React, { useEffect } from 'react'
import { FC } from 'react'
import './tab-dropdown.styles.scss'
import { TabData } from '../tabs-panel/tabs-panel.types'
import { TabDropdownProps } from './tab-dropdown.types'

const id = Math.random().toString(36).substring(2)
export const TabDropdown: FC<TabDropdownProps> = ({ tabs, onMenuClicked, onCloseClicked }) => {
  const [listClass, setListClass] = React.useState('hidden')

  useEffect(() => {
    document.addEventListener('mousedown', onMouseClicked)
  }, [])

  useEffect(() => {
    if (tabs.length === 0) setListClass('hidden')
  }, [tabs])

  const switchMenuVisibility = () => {
    setListClass(listClass === '' ? 'hidden' : '')
  }

  const onMouseClicked = (e: MouseEvent): void => {
    const component = document.getElementById(id)
    if (!component) return document.removeEventListener('mousedown', onMouseClicked)
    if (component.contains(e.target as Node)) return

    setListClass('hidden')
  }

  const onMenuItemClicked = (tab: TabData) => {
    // setListClass('hidden')
    onMenuClicked(tab.requestId)
  }

  const onMenuItemCloseClicked = (e: MouseEvent, tab: TabData) => {
    onCloseClicked(tab.requestId)
    e.stopPropagation()
  }

  return (
    <div className={`tab-dropdown ${tabs.length ? '' : 'hidden'}`} id={id}>
      <div className='button' onClick={switchMenuVisibility}>
        {tabs.length > 1 && (<span className='counter'>{tabs.length}</span>)}
        <i className='fa-solid fa-ellipsis-vertical'></i>
      </div>
      <ul className={listClass}>
        {tabs.map((tab) => (<li
          key={tab.requestId}
          className={tab.isActive ? 'active' : ''}
          onClick={() => onMenuItemClicked(tab)}>
          <div className='btn-close' onClick={(e) => onMenuItemCloseClicked(e, tab)}><i className='fa-solid fa-xmark'></i></div>
          <div className='title'>{tab.title}</div>
        </li>))}
      </ul>
    </div>
  )
}
