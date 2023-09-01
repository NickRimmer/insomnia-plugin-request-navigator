import * as insomnia from './services/insomnia/connector'
import * as ui from './ui'
import { database } from './services/db'
import { getRouter } from './services/insomnia/connector/refs-router'

const initAsync = async () => {
  // initialize ui components
  await ui.renderAsync()
  // await cleanupWorkspacesAsync()

  window.dev = {
    router: getRouter(),
    database: database,
  }
}

let tries = 0
const waitForConnectionAsync = async () => {
  if (!insomnia.connect()) {
    if (tries++ < 25) window.setTimeout(waitForConnectionAsync, 200)
    else console.error('[plugin-navigator]', 'cannot connect to Insomnia')
  } else await initAsync()
}

waitForConnectionAsync()
