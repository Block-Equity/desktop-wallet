import NeDB from 'nedb'

import {
  DATABASE_PATH,
  DOCUMENT_TYPE_USER_INFO
} from './constants'

let db = null

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
        const newDoc = { type: DOCUMENT_TYPE_USER_INFO, accounts: {} }
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
        resolve({
          accounts: doc.accounts,
          exists: true
        })
      }
    })
  })
}

export const addUserAccount = ({ publicKey, secretKey, balance, sequence }) => {
  const accountCreated = {
    [publicKey]: {
      pKey: publicKey,
      sKey: secretKey,
      balance,
      sequence
    }
  }

  return new Promise((resolve, reject) => {
    db.update({ type: DOCUMENT_TYPE_USER_INFO }, { $set: { accounts: accountCreated } },
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
    db.update({ type: DOCUMENT_TYPE_USER_INFO }, { $set: { accounts: { [publicKey]: updatedAccount } } }, { returnUpdatedDocs: true, multi: false }, (err, numReplaced, affectedDocuments) => {
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
    db.remove({}, { multi: true }, (err, numRemoved) => {
      if (err) {
        reject(err)
        return
      }
      console.log('Document successfully removed')
      resolve()
    })
  })
}
