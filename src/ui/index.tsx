import ReactDOM from 'react-dom'
import { TabsPanel } from './tabs-panel'
import React from 'react'
import './index.styles.scss'

export const render = () => {
  // find app header
  const header: HTMLElement | null = document.querySelector('.app-header')
  if (!header) throw new Error('Root element not found')

  // check if root element already exists
  const existsRoot: HTMLElement | null = document.querySelector('#plugin-request-navigator-hub')
  if (existsRoot) {
    console.warn('Plugin Request Navigator is already loaded. Removing old version...')
    existsRoot.remove()
  }

  const root = document.createElement('div')
  root.id = 'plugin-request-navigator-hub'
  header.appendChild(root)

  //TODO fix first render on application start
  ReactDOM.render(
    (<TabsPanel />),
    root
  )

}
