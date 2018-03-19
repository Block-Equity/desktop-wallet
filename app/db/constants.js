import electron from 'electron'
import path from 'path'

const appPath = (electron.app || electron.remote.app).getPath('appData')

export const DATABASE_PATH = path.join(appPath, 'BlockEQ/Databases/user.db')
export const DOCUMENT_TYPE_USER_INFO = 'userInfo'
