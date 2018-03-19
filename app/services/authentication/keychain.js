const { ipcRenderer } = require('electron');

export const setPassword = (service, user, password) => {
  return ipcRenderer.sendSync('set-password', service, user, password)
}

export const getPassword = (service, user) => {
  return ipcRenderer.sendSync('get-password', service, user)
}

export const deletePassword = (service, user) => {
  return ipcRenderer.sendSync('delete-password', service, user)
}