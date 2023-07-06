import React, { FC } from 'react'
import { TabButtonProps } from './tab-button.types'
import './tab-button.styles.scss'

export const TabButton: FC<TabButtonProps> = ({ children, isActive, onClickButton, onClickClose, requestId, title }) => {
  const onClickButtonInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => onClickButton ? onClickButton(e) : null
  const onClickCloseInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    if (onClickClose) onClickClose(e)
  }

  return (
    <div
      className={`plugin-request-navigator-tab-button ${isActive ? 'active' : ''}`}
      onClick={onClickButtonInternal}
      data-request-id={requestId}
      data-title={title}
    >
      {/* <div className='context-menu'>
        <div>Menu 1</div>
        <div>Menu 2</div>
        <div>Menu 3</div>
      </div> */}
      <div className='btn-close' onClick={onClickCloseInternal}><i className='fa-solid fa-xmark'></i></div>
      <div className='title'>{children}</div>
    </div>
  )
}
