let currentInsomniaConnectionId: string | null = null

// export const getCurrentInsomniaConnectionId = (): string | null => currentInsomniaConnectionId

export const initConnection = (): void => {
  currentInsomniaConnectionId = Math.random().toString(36).substring(2)
  localStorage.setItem('insomniaConnectionId', currentInsomniaConnectionId)
}

export const isCurrentConnectionStillActive = (): boolean => {
  if (currentInsomniaConnectionId === '') throw new Error('insomnia connection is not initialized')
  const result = currentInsomniaConnectionId === localStorage.getItem('insomniaConnectionId')
  if (!result) console.warn('[plugin-navigator]', 'insomnia connection is not active', currentInsomniaConnectionId, localStorage.getItem('insomniaConnectionId'))

  return result
}
