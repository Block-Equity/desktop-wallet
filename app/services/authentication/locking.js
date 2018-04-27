import fs from 'fs'
import promisify from 'util.promisify'
import { encryptBuffer, decryptBuffer } from '../security/encryption'
import { DATABASE_PATH } from '../../db/constants'

const DATABASE_PATH_ENCRYPTED = `${DATABASE_PATH}.enc`

const promisifiedReadFile = promisify(fs.readFile)
const promisifiedWriteFile = promisify(fs.writeFile)
const promisifiedUnlink = promisify(fs.unlink)

/**
 * Creates a descrypted version of the database.
 */
export const unlock = async ({ password = undefined }) => {
  let buffer

  try {
    buffer = await promisifiedReadFile(DATABASE_PATH_ENCRYPTED)
  } catch (e) {
    console.log(`No encrypted database file found. That's ok, will skip.`)
  }

  if (buffer) {
    let decrypted
    try {
      console.log('Encrypted database file found. Will descript.')
      decrypted = await decryptBuffer(buffer, password)
    } catch (e) {
      throw new Error('Unable to decrypt database file')
    }

    try {
      await promisifiedWriteFile(DATABASE_PATH, decrypted)
    } catch (e) {
      // If this error is thrown then the credentials are probably invalid. At this point,
      throw new Error('Unable to create a decrypted database file')
    }
  }
}

/**
 * Encripts the database instance
 */
export const lock = async ({ password = undefined }) => {
  try {
    let buffer = await promisifiedReadFile(DATABASE_PATH)
    let encrypted = await encryptBuffer(buffer, password)
    console.log('Decrypted database file found. Will descript.')

    // Create an encrypted copy of the databaase
    await promisifiedWriteFile(DATABASE_PATH_ENCRYPTED, encrypted)
  } catch (e) {
    throw new Error('Unable create an encrypted copy of the database')
  }

  // Remove the decrypted database
  console.log('Removing Descrypted file')

  let p = await promisifiedUnlink(DATABASE_PATH).catch(e => {
    console.log('No descrypted database file found. Will skip')
    return true
  })

  return Promise.all([p])
}

export const destroy = async () => {
  let p1 = promisifiedUnlink(DATABASE_PATH_ENCRYPTED).catch(e => {
    console.log('No encrypted database file found. Will skip.')
    return true
  })

  let p2 = promisifiedUnlink(DATABASE_PATH).catch(e => {
    console.log('No descrypted database file found. Will skip')
    return true
  })

  return Promise.all([p1, p2])
}
