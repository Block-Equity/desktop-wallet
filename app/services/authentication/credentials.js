import keytar from 'keytar'
import { create as createHash } from '../security/password'
import config from 'config'

const APP_IDENTIFIER = config.get('app.identifier')
const APP_NAME = config.get('app.name')
const ACCOUNT = `${APP_NAME}.verification`

const get = async () => {
  return keytar.getPassword(APP_IDENTIFIER, ACCOUNT)
}

export const verify = async (username, password) => {
  let storedHash = await get()

  let hash = await createHash({
    text: username + password,
    salt: APP_NAME
  })

  if (hash !== storedHash) {
    throw new Error('Invalid password')
  }

  let token = await createHash({
    text: hash + password,
    salt: APP_NAME
  })

  return token
}

export const update = async (username, password) => {
  let hash = await createHash({
    text: username + password,
    salt: APP_NAME
  })

  return keytar.setPassword(APP_IDENTIFIER, ACCOUNT, hash)
}
