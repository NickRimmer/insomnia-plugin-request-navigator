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
      className={`tab-button ${isActive ? 'active' : ''}`}
      onClick={onClickButtonInternal}
      data-request-id={requestId}
      data-title={title}
    >
      <div className='btn-close' onClick={onClickCloseInternal}><i className='fa-solid fa-xmark'></i></div>
      <div className='title'>{children}</div>
    </div>
  )
}
