import keytar from 'keytar'

import { create as createHash } from '../security/password'

// TODO: clean this up into a config file
const SERVICE = `com.blockeq.${process.env.NODE_ENV}`
const ACCOUNT = 'com.blockeq.verification'
const SALT = 'blockeq'

const get = async () => {
  return keytar.getPassword(SERVICE, ACCOUNT)
}

export const verify = async (username, password) => {
  let storedHash = await get()

  let hash = await createHash({
    text: username + password,
    salt: SALT
  })

  if (hash !== storedHash) {
    throw new Error('Invalid password')
  }

  let token = await createHash({
    text: hash + password,
    salt: SALT
  })

  return token
}

export const update = async (username, password) => {
  let hash = await createHash({
    text: username + password,
    salt: SALT
  })

  return keytar.setPassword(SERVICE, ACCOUNT, hash)
}
