import keytar from 'keytar'
import authenticator from 'authenticator'
import { decryptText, encryptText } from '../security/encryption'
import config from 'config'

const APP_IDENTIFIER = config.get('app.identifier')
const ACCOUNT = `${config.get('app.name')}.2fa`

const get = async (password) => {
  let result = await keytar.getPassword(APP_IDENTIFIER, ACCOUNT)
  return decryptText(result, password)
}

const update = async (secret, password) => {
  let result = await encryptText(secret, password)
  return keytar.setPassword(APP_IDENTIFIER, ACCOUNT, result)
}

export const remove = async () => {
  return keytar.deletePassword(APP_IDENTIFIER, ACCOUNT)
}

export const verify = async (token) => {
  // 1) Get the secret
  const secret = await get()

  // 2) Check that the token is valid
  const delta = authenticator.verifyToken(secret, token)

  // 3) If it's not, then throw an error
  if (delta === null) {
    throw new Error('Invalid token')
  }

  return true
}

export const enroll = async (username) => {
  // TODO: auto-generate this
  let secret = authenticator.generateKey()

  await update(secret)

  let result = authenticator.generateTotpUri(secret, username, 'BlockEQ', 'SHA1', 6, 30)

  return result
}
