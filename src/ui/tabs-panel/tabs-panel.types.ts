export type TabData = {
  requestId: string;
  title: string;
  isActive: boolean;
}

export type UseTabsPanelData = {
  tabs: TabData[];
  collapsedTabs: TabData[];
  onTabClick: (requestId: string) => void;
  onCloseClick: (requestId: string) => void;
}
