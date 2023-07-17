/* eslint-disable @typescript-eslint/no-explicit-any */
import { WindowApp, WindowMain } from './insomnia/insomnia.types'

declare global {
  interface Window {
    app: WindowApp,
    main: WindowMain
  }
}

type WindowApp = {
  getAppPath: () => string,
  getPath: (name: string) => string,
}

type WindowMain = {
  on(channelName: string, callback: (e: any, data: any) => void): (() => void),
}
