import React, { FC } from 'react'
import { TabButtonProps } from './tab-button.types'
import './tab-button.styles.scss'

export const TabButton: FC<TabButtonProps> = ({ children, isActive, onClickButton, onClickClose, requestId, title, method, isHidden }) => {
  const onClickButtonInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => onClickButton ? onClickButton(e) : null
  const onClickCloseInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    if (onClickClose) onClickClose(e)
  }

  return (
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
  )
}
