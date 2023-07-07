import React, { ForwardRefRenderFunction, forwardRef, useEffect, useImperativeHandle } from 'react'
import { ContextMenuProps, ContextMenuRef, ContextMenuState } from './context-menu-container.types'

const ContextMenuContainerInternal: ForwardRefRenderFunction<ContextMenuRef, ContextMenuProps> = ({ children, menu }, ref) => {
  const [state, setState] = React.useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
  })


  const internalRef = React.useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useImperativeHandle(ref, () => ({
    closeMenu: () => setState({
      isOpen: false,
      x: 0,
      y: 0,
    })
  }))

  const onContextMenu = (x: number, y: number) => setState({
    isOpen: true,
    x,
    y,
  })

  const onClickOutside = (event: MouseEvent) => {
    if (
      internalRef?.current !== null &&
      event.target !== internalRef.current &&
      !internalRef.current.contains(event.target as Node)
    ) {
      setState({
        isOpen: false,
        x: 0,
        y: 0,
      })
    }
  }

  return (
    <>
      {React.cloneElement(children, {
        onContextMenu: (event: MouseEvent) => {
          event.preventDefault()
          onContextMenu(event.pageX, event.pageY)
        }
      })}

      {state.isOpen && (
        <div
          ref={menu => internalRef.current = menu}
          style={{
            position: 'absolute',
            left: state.x,
            top: state.y,
            margin: 0,
            padding: 0,
          }}>
          {menu}
        </div>
      )}
    </>
  )
}

export const ContextMenuContainer = forwardRef<ContextMenuRef, ContextMenuProps>(ContextMenuContainerInternal)
