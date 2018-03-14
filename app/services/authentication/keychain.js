import { ipcRenderer } from 'electron'
const keytar = ipcRenderer.require('keytar')

const setPassword = (service, user, password) => {
  return ipcRenderer.sendSync('set-password', service, user, pass)
}

const getPassword = (service, user) => {
  return ipcRenderer.sendSync('get-password', service, user)
}

const deletePassword = (service, user) => {
  return ipcRenderer.sendSync('delete-password', service, user)
}