import { initConnection } from './refs-common'
import { initRouter } from './refs-router'
import { initEvents } from './refs-events'

export const connect = async () => {
  initConnection()

  const routerWasFound = await initRouter()
  if (!routerWasFound) {
    return false
  }

  initEvents()

  return true
};
