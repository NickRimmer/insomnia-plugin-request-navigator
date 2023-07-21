import ReactDOM from 'react-dom'
import { TabsPanel } from './tabs-panel'
import React from 'react'
import './index.styles.scss'

export const renderAsync = (): Promise<void> => new Promise((resolve, reject) => {
  // find app header
  const header: HTMLElement | null = document.querySelector('.app-header')
  if (!header) {
    reject(new Error('App header not found'))
    return
  }

  // check if root element already exists
  const existsRoot: HTMLElement | null = document.querySelector('#plugin-request-navigator-hub')
  if (existsRoot) {
    console.warn('Plugin Request Navigator is already loaded. Removing old version...')
    existsRoot.remove()
  }

  const root = document.createElement('div')
  root.id = 'plugin-request-navigator-hub'
  header.appendChild(root)

  ReactDOM.render(
    (<TabsPanel />),
    root,
    () => resolve()
  )
})
