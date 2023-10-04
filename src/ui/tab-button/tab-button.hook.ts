import React from 'react'
import { ContextMenuRef } from '../context-menu-container'
import { TabButtonProps } from './tab-button.types'

export const useTabButton = ({ onClickClose, onClickButton, onClickCloseOthers, onClickCloseOnRight, onClickCloseAll }: TabButtonProps) => {
  const contextMenuRef = React.useRef<ContextMenuRef | null>(null)
  const onClickButtonInternal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => onClickButton ? onClickButton(e) : null

  const onClickAuxInternal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e.button === 1) {
      e.stopPropagation()
      if (onClickClose) onClickClose(e)
    }
  }

  const onClickCloseInternal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    if (onClickClose) onClickClose(e)
  }

  const onContextCloseTab = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    contextMenuRef.current?.closeMenu()
    if (onClickClose) onClickClose(e)
  }

  const onContextCloseOthers = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    contextMenuRef.current?.closeMenu()
    if (onClickCloseOthers) onClickCloseOthers(e)
  }

  const onContextCloseOnRight = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    contextMenuRef.current?.closeMenu()
    if (onClickCloseOnRight) onClickCloseOnRight(e)
  }

  const onContextCloseAll = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    contextMenuRef.current?.closeMenu()
    if (onClickCloseAll) onClickCloseAll(e)
  }

  return {
    contextMenuRef,
    onClickButton: onClickButtonInternal,
    onClickAuxButton: onClickAuxInternal,
    onClickClose: onClickCloseInternal,
    onContextCloseTab,
    onContextCloseOthers,
    onContextCloseOnRight,
    onContextCloseAll,
  }
}
