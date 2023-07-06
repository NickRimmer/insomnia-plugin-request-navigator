export type ContextMenuProps = {
  children: React.ReactElement;
  menu: React.ReactNode;
  contextMenuRef: React.MutableRefObject<ContextMenuRef | null>;
}

export type ContextMenuRef = {
  closeMenu: () => void;
}

export type ContextMenuState = {
  isOpen: boolean;
  x: number;
  y: number;
}
