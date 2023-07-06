import * as insomnia from './services/insomnia/connector'
import * as ui from './ui'

const init = () => {
  // can be used during development, to be able to access insomnia instance from console for experiments
  // global.dev = {}
  // global.dev.insomnia = insomnia

  // initialize ui components
  ui.render()
  console.log('[plugin-navigator]', 'initialized')
}

let tries = 0
const waitForConnection = () => {
  if (!insomnia.connect()) {
    if (tries++ < 25) window.setTimeout(waitForConnection, 200)
    else console.error('[plugin-navigator]', 'cannot connect to Insomnia')
  } else init()
}

waitForConnection()
