import { initConnection } from './refs-common'
import { initRouter } from './refs-router'
import { initEvents } from './refs-events'

export const connect = (): boolean => {
  initConnection()
  if (!initRouter()) return false
  initEvents()

  return true
}
