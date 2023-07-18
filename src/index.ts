import * as insomnia from './services/insomnia/connector'
import * as ui from './ui'
import { cleanupWorkspacesAsync } from './services/db'

const initAsync = async () => {
  // can be used during development, to be able to access insomnia instance from console for experiments
  // (global as any).dev = {
  //   insomnia
  // }

  // initialize ui components
  ui.render()
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
