import fs from 'fs'
import electron from 'electron'
import NeDB from 'nedb'
import path from 'path'
import promisify from 'util.promisify'
import { encrypt, decrypt } from './encryption'

const promisifiedReadFile = promisify(fs.readFile)
const promisifiedWriteFile = promisify(fs.writeFile)
const promisifiedUnlink = promisify(fs.unlink)

export default class Storage {
  constructor ({ password = undefined }) {
    const appPath = (electron.app || electron.remote.app).getPath('appData')
    // Simply for security concerns, do some composition with the encrypt/decrypt functions,
    // so that we can add `password` without having to explicitly store as a property of any object.
    this.encrypt = (buffer) => encrypt(buffer, password)
    this.decrypt = (buffer) => decrypt(buffer, password)
    this.decryptedPath = path.join(appPath, 'user.db')
    this.encryptedPath = path.join(appPath, 'user.db.enc')
  }

  /**
   * Creates a descrypted version of the database.
   * @return {NeDB} an NeDB object
   */
  async open () {
    let buffer

    try {
      buffer = await promisifiedReadFile(this.encryptedPath)
    } catch (e) {
      console.log(`No encrypted database file found. That's ok, will skip.`)
    }

    if (buffer) {
      let decrypted
      try {
        console.log('Encrypted database file found. Will descript.')
        decrypted = this.decrypt(buffer)
      } catch (e) {
        throw new Error('Unable to decrypt database file')
      }

      try {
        await promisifiedWriteFile(this.decryptedPath, decrypted)
      } catch (e) {
        // If this error is thrown then the credentials are probably invalid. At this point,
        throw new Error('Unable to create a decrypted database file')
      }
    }

    let db = new NeDB({ filename: this.decryptedPath, autoload: true })
    return db
  }

  /**
   * Encripts the database instance
   * @return {NeDB} an NeDB object
   */
  async close () {
    try {
      let buffer = await promisifiedReadFile(this.decryptedPath)
      let encrypted = this.encrypt(buffer)
      // Create an encrypted copy of the databaase
      await promisifiedWriteFile(this.encryptedPath, encrypted)
    } catch (e) {
      throw new Error('Unable create an encrypted copy of the database')
    }

    // Remove the decrypted database
    await promisifiedUnlink(this.decryptedPath)
  }

  destroy () {
    let p1 = promisifiedUnlink(this.encryptedPath).catch(e => {
      console.log('No encrypted database file found. Will skip.')
      return true
    })

    let p2 = promisifiedUnlink(this.decryptedPath).catch(e => {
      console.log('No descrypted database file found. Will skip')
      return true
    })

    return Promise.all([p1, p2])
  }
}
