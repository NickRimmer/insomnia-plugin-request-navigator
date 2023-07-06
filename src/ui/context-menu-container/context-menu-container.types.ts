export type ContextMenuProps = {
  children: React.ReactElement;
  menu: React.ReactNode;
}

export type ContextMenuRef = {
  closeMenu: () => void;
}

export type ContextMenuState = {
  isOpen: boolean;
  x: number;
  y: number;
}
