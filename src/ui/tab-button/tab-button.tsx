import React, { FC } from 'react'
import { TabButtonProps } from './tab-button.types'
import './tab-button.styles.scss'
import { ContextMenuContainer, ContextMenuRef } from '../context-menu-container'

export const TabButton: FC<TabButtonProps> = ({ children, isActive, onClickButton, onClickClose, requestId, title, method, isHidden }) => {
  const contextMenuRef = React.useRef<ContextMenuRef | null>(null)
  const onClickButtonInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => onClickButton ? onClickButton(e) : null
  const onClickCloseInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    if (onClickClose) onClickClose(e)
  }

  return (
    <ContextMenuContainer
      ref={contextMenuRef}
      menu={
        <ul className='context-menu'>
          <li onClick={() => contextMenuRef.current?.closeMenu()}>Close tab</li>
          <li>Close tabs on right</li>
          <li>Close all other tabs</li>
        </ul>
      }>
      <div
        className={`plugin-request-navigator-tab-button ${isActive ? 'active' : ''} ${isHidden ? 'hidden' : ''}`}
        onClick={onClickButtonInternal}
        data-request-id={requestId}
        data-title={title}
      >
        <div className='btn-close' onClick={onClickCloseInternal}><i className='fa-solid fa-xmark'></i></div>
        <div className='title'>
          <span className={`method ${method.toLocaleLowerCase()}`}>{method.toUpperCase()}</span>
          <span>{children}</span>
        </div>
      </div>
    </ContextMenuContainer>
  )
}
