import keychain from '../authentication/keychain'
import authenticator from 'authenticator'
import { decryptText, encryptText } from '../security/encryption'
//mport config from 'config'

//TODO: Issues with getting production config variable in production build
const APP_IDENTIFIER = 'com.blockeq'
const ACCOUNT = `BlockEQ.2fa`

const get = async (password) => {
  let result = await keychain.getPassword(APP_IDENTIFIER, ACCOUNT)
  return decryptText(result, password)
}

const update = async ({ secret, password }) => {
  let result = await encryptText(secret, password)
  return keychain.setPassword(APP_IDENTIFIER, ACCOUNT, result)
}

export const remove = async () => {
  return keychain.deletePassword(APP_IDENTIFIER, ACCOUNT)
}

export const verify = async ({ password, code }) => {
  // 1) Get the secret
  const secret = await get(password)

  // 2) Check that the token is valid
  const delta = authenticator.verifyToken(secret, code)

  // 3) If it's not, then throw an error
  if (delta === null) {
    throw new Error('Invalid token')
  }

  return true
}

export const enroll = async ({ username, password }) => {
  // TODO: auto-generate this
  let secret = authenticator.generateKey()

  await update({ secret, password })

  const ALGORITHM = 'SHA1'

  // Determines how long of a one-time passcode to display to the user.
  // (may have the values 6 or 8)
  const DIGITS = 6

  // Defines a period that a TOTP code will be valid for, in seconds.
  const PERIOD = 30

  let result = authenticator.generateTotpUri(
    secret,
    username,
    config.get('app.name'),
    ALGORITHM,
    DIGITS,
    PERIOD
  )

  return result
}
