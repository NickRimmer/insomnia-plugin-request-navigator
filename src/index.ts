import * as insomnia from './services/insomnia/connector'
import * as ui from './ui'
import { cleanupWorkspacesAsync } from './services/db'

const initAsync = async () => {
  // initialize ui components
  await ui.renderAsync()
  await cleanupWorkspacesAsync()
  console.log('[plugin-navigator]', 'initialized')
}

let tries = 0
const waitForConnectionAsync = async () => {
  if (!insomnia.connect()) {
    if (tries++ < 25) window.setTimeout(waitForConnectionAsync, 200)
    else console.error('[plugin-navigator]', 'cannot connect to Insomnia')
  } else await initAsync()
}

waitForConnectionAsync()
