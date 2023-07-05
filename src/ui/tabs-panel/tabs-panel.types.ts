import { SortEndHandler } from 'react-sortable-hoc'

export type TabData = {
  requestId: string;
  title: string;
  isActive: boolean;
}

export type UseTabsPanelData = {
  tabs: TabData[];
  collapsedTabs: TabData[];
  onTabClicked: (requestId: string) => void;
  onCloseClicked: (requestId: string) => void;
  onSortEnd: SortEndHandler;
}
