export type WorkspaceTab = {
  requestId: string,
  index: number,
  isActive?: boolean,
}

export type Workspace = {
  workspaceId: string,
  tabs: WorkspaceTab[],
}
