import React, { FC } from 'react'
import { TabButtonProps } from './tab-button.types'
import './tab-button.styles.scss'
import { ContextMenuContainer } from '../context-menu-container'
import { useTabButton } from './tab-button.hook'

export const TabButton: FC<TabButtonProps> = (props) => {
  const { children, isActive, requestId, title, method, isHidden } = props
  const { contextMenuRef, onClickButton, onClickClose, onContextCloseTab, onContextCloseOthers, onContextCloseOnRight, onContextCloseAll } = useTabButton(props)

  return (
    <ContextMenuContainer
      ref={contextMenuRef}
      menu={
        <ul className='context-menu'>
          <li onClick={onContextCloseTab}>Close tab</li>
          <li onClick={onContextCloseOnRight}>Close on right</li>
          <li onClick={onContextCloseOthers}>Close others</li>
          <li onClick={onContextCloseAll}>Close all</li>
        </ul>
      }>
      <div
        className={`plugin-request-navigator-tab-button ${isActive ? 'active' : ''} ${isHidden ? 'hidden' : ''}`}
        onClick={onClickButton}
        data-request-id={requestId}
        data-title={title}
        data-method={method}
      >
        <div className='btn-close' onClick={onClickClose}>
          <i className='fa-solid fa-xmark'></i>
        </div>
        <div className='title'>
          {method && <span className={`method ${method.toLocaleLowerCase()}`}>{method.toUpperCase()}</span>}
          <span>{children}</span>
        </div>
      </div>
    </ContextMenuContainer>
  )
}
