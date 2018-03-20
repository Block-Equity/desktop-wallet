import NeDB from 'nedb'
import * as encryption from '../services/security/encryption'

import {
  DATABASE_PATH,
  DOCUMENT_TYPE_USER_INFO,
  APP_VERSION
} from './constants'

let db = null

export const databaseExists = async () => {
  db = new NeDB({ filename: DATABASE_PATH, autoload: true })
  console.log('DATABASE_PATH', DATABASE_PATH)

  return new Promise((resolve, reject) => {
    db.findOne({ type: DOCUMENT_TYPE_USER_INFO }, (err, doc) => {
      if (err) {
        reject(err)
        return
      }

      if (!doc) {
        console.log('Document does not exist')
        resolve({
          exists: false
        })
      } else {
        console.log('Document exists')
        resolve({
          exists: true,
          pin: doc.pin,
          appVersion: doc.appVersion
        })
      }
    })
  })
}

export const initialize = async () => {
  db = new NeDB({ filename: DATABASE_PATH, autoload: true })
  console.log('DATABASE_PATH', DATABASE_PATH)

  return new Promise((resolve, reject) => {
    db.findOne({ type: DOCUMENT_TYPE_USER_INFO }, (err, doc) => {
      if (err) {
        reject(err)
        return
      }
      console.log(`UserDB || Data: ${JSON.stringify(doc)}`)

      if (!doc) {
        console.log('Create New Document')
        const newDoc = { type: DOCUMENT_TYPE_USER_INFO, accounts: {}, pin: '', appVersion: APP_VERSION }
        db.insert(newDoc, (err, newDocument) => {
          if (err) {
            reject(err)
            return
          }
          console.log(`Created new document! || Data: ${JSON.stringify(newDocument)}`)
          resolve({
            accounts: newDocument.accounts,
            exists: false
          })
        })
      } else {
        console.log('Document exists')
        resolve({
          accounts: doc.accounts,
          exists: true
        })
      }
    })
  })
}

export const setUserPIN = (value) => {
  const encrypted = encryption.encryptText(value, DATABASE_PATH)
  const pinCreated = {
    pin: encrypted
  }
  return new Promise((resolve, reject) => {
    db.update({ type: DOCUMENT_TYPE_USER_INFO }, { $set: pinCreated },
      { returnUpdatedDocs: true, multi: false }, (err, numReplaced, affectedDocuments) => {
      if (err) {
        reject(err)
        return
      }
      console.log(`Updated: ${numReplaced} || Data: ${JSON.stringify(affectedDocuments)}`)
      resolve(affectedDocuments.pin)
    })
  })
}

export const getUserPIN = () => {
  return new Promise((resolve, reject) => {
    db.findOne({ type: DOCUMENT_TYPE_USER_INFO }, (err, doc) => {
      if (err) {
        reject(err)
        return
      }
      if (doc) {
        const decrypt = encryption.decryptText(doc.pin, DATABASE_PATH)
        resolve({
          pin: decrypt,
          exists: true
        })
      } else {
        resolve({
          exists: false
        })
      }
    })
  })
}

export const addUserAccount = ({ publicKey, secretKey, balance, sequence }) => {
  const accountCreated = {
    [`accounts.${publicKey}`]: {
      pKey: publicKey,
      sKey: secretKey,
      balance,
      sequence
    }
  }

  return new Promise((resolve, reject) => {
    db.update({ type: DOCUMENT_TYPE_USER_INFO }, { $set: accountCreated },
      { returnUpdatedDocs: true, multi: false }, (err, numReplaced, affectedDocuments) => {
      if (err) {
        reject(err)
        return
      }
      console.log(`Updated: ${numReplaced} || Data: ${JSON.stringify(affectedDocuments)}`)
      resolve(affectedDocuments.accounts)
    })
  })
}

export const updateUserAccount = ({ publicKey, secretKey, balance, sequence }) => {
  const updatedAccount = {
    pKey: publicKey,
    sKey: secretKey,
    balance,
    sequence
  }
  return new Promise((resolve, reject) => {
    db.update({ type: DOCUMENT_TYPE_USER_INFO }, { $set: { accounts: { [publicKey]: updatedAccount } } },
      { returnUpdatedDocs: true, multi: false }, (err, numReplaced, affectedDocuments) => {
      if (err) {
        reject(err)
        return
      }
      console.log(`Updated: ${numReplaced} || Data: ${JSON.stringify(affectedDocuments)}`)
      resolve(affectedDocuments.accounts)
    })
  })
}

// Transaction
// https://www.stellar.org/developers/js-stellar-base/reference/building-transactions.html
export const setTransactionSequence = (account, sequence) => {
  // updated sequence ready for next transaction
  return new Promise((resolve, reject) => {
    db.update({pkey: account}, { $set: { sequence: sequence } }, { returnUpdatedDocs: true }, (err, numReplaced, affectedDocuments) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

export const getTransactionSequence = () => {
  // last sequence used
}

export const clearAllUserInfo = () => {
  return new Promise((resolve, reject) => {
    db.remove({ }, { multi: true }, (err, numRemoved) => {
      if (err) {
        reject(err)
        return
      }
      console.log('Document successfully removed')
      resolve()
    })
  })
}
