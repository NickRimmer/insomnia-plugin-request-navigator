import { TabData } from '../tabs-panel/tabs-panel.types'

export type TabDropdownProps = {
  tabs: TabData[],
  onMenuClicked: (requestId: string) => void,
  onCloseClicked: (requestId: string) => void,
}
