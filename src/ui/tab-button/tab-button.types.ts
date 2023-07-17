import { MouseEventHandler, ReactNode } from 'react'

export type TabButtonProps = {
  children: ReactNode,
  onClickButton?: MouseEventHandler | undefined,
  onClickClose?: MouseEventHandler | undefined,
  onClickCloseOthers?: MouseEventHandler | undefined,
  onClickCloseOnRight?: MouseEventHandler | undefined,
  onClickCloseAll?: MouseEventHandler | undefined,
  isActive?: boolean,
  isHidden?: boolean,
  requestId: string,
  title: string,
  method: string | undefined,
}
