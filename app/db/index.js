import NeDB from 'nedb'
import * as encryption from '../services/security/encryption'
import * as locking from '../services/authentication/locking'

import {
  DATABASE_PATH,
  DOCUMENT_TYPE_USER_INFO,
  APP_VERSION
} from './constants'

let db = null

export const databaseExists = async () => {
  await locking.unlock({ password: DATABASE_PATH})
  db = new NeDB({ filename: DATABASE_PATH, autoload: true })

  return new Promise((resolve, reject) => {
    db.findOne({ type: DOCUMENT_TYPE_USER_INFO }, (err, doc) => {
      if (err) {
        reject(err)
        return
      }

      if (!doc) {
        resolve({
          exists: false
        })
      } else {
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

  return new Promise((resolve, reject) => {
    db.findOne({ type: DOCUMENT_TYPE_USER_INFO }, (err, doc) => {
      if (err) {
        reject(err)
        return
      }

      if (!doc) {
        const newDoc = { type: DOCUMENT_TYPE_USER_INFO, accounts: {}, pin: '', phrase: '', appVersion: APP_VERSION }
        db.insert(newDoc, (err, newDocument) => {
          if (err) {
            reject(err)
            return
          }

          resolve({
            accounts: newDocument.accounts,
            exists: false
          })
        })
      } else {
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

export const setPhrase = (value, pin) => {
  const encrypted = encryption.encryptText(value, pin)
  const phraseCreated = {
    phrase: encrypted
  }
  return new Promise((resolve, reject) => {
    db.update({ type: DOCUMENT_TYPE_USER_INFO }, { $set: phraseCreated },
      { returnUpdatedDocs: true, multi: false }, (err, numReplaced, affectedDocuments) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

export const getPhrase = (pin) => {
  return new Promise((resolve, reject) => {
    db.findOne({ type: DOCUMENT_TYPE_USER_INFO }, (err, doc) => {
      if (err) {
        reject(err)
        return
      }
      if (doc) {
        const decrypt = encryption.decryptText(doc.phrase, pin)
        resolve({
          phrase: decrypt,
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

export const addUserAccount = ({ publicKey, secretKey, balances, sequence, type }) => {
  const accountCreated = {
    [`accounts.${publicKey}`]: {
      pKey: publicKey,
      sKey: secretKey,
      balances,
      sequence,
      type
    }
  }

  return new Promise((resolve, reject) => {
    db.update({ type: DOCUMENT_TYPE_USER_INFO }, { $set: accountCreated },
      { returnUpdatedDocs: true, multi: false }, (err, numReplaced, affectedDocuments) => {
      if (err) {
        reject(err)
        return
      }
      resolve(affectedDocuments.accounts)
    })
  })
}

export const updateUserAccount = ({ publicKey, secretKey, balances, sequence, type, inflationDestination }) => {
  const updatedAccount = {
    pKey: publicKey,
    sKey: secretKey,
    balances,
    sequence,
    type,
    inflationDestination
  }
  return new Promise((resolve, reject) => {
    db.update({ type: DOCUMENT_TYPE_USER_INFO }, { $set: { accounts: { [publicKey]: updatedAccount } } },
      { returnUpdatedDocs: true, multi: false }, (err, numReplaced, affectedDocuments) => {
      if (err) {
        reject(err)
        return
      }
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
  return new Promise(async (resolve, reject) => {
    /*db.remove({ }, { multi: true }, (err, numRemoved) => {
      if (err) {
        reject(err)
        return
      }
      console.log('Document successfully removed')
      resolve()
    })*/
    await locking.destroy()
    resolve()
  })
}
