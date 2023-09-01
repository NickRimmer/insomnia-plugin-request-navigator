export type InsomniaDocBase = {
  _id: string;
  type: string;
  parentId?: string;
  modified: number;
  created: number;
  isPrivate: boolean;
  name: string;
}

export type InsomniaDocCollectionItem = {
  doc: InsomniaDocBase
}

export type InsomniaRouter = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe: (callback: (data: any) => void) => () => void
  navigate: (url: string) => void
  state: {
    loaderData: {
      '/organization': {
        organizations: InsomniaDocBase[]
      },
      ':workspaceId': {
        // activeEnvironment: InsomniaDocBase
        activeProject: InsomniaDocBase
        activeWorkspace: InsomniaDocBase
        // activeWorkspaceMeta: InsomniaDocBase
        // baseEnvironment: InsomniaDocBase
        collection: InsomniaDocCollectionItem[]
      },
      'request/:requestId': {
        activeRequest: InsomniaDocBase
      },
      '/project/:projectId': {
        workspaces: InsomniaDocBase[],
      },
    },
    location: {
      pathname: string,
    }
  }
}

export type InsomniaRouterEvent = {
  historyAction: string
  location: {
    pathname: string
  }
}
