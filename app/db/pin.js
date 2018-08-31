import * as encryption from '../services/security/encryption'

import db from './db'
import { 
  DATABASE_PATH,
  DOCUMENT_TYPE_USER_INFO 
} from './constants'

const documentType = { type: DOCUMENT_TYPE_USER_INFO }

export const SEQUENCE = 'sequence'
export const GATE_LAUNCH = 'gateLaunch'
export const GATE_PAYMENT = 'gatePayment'
export const GATE_VIEW_MNEMONIC = 'gateViewMnemonic'

const defaultPIN = {
  [SEQUENCE]: '',
  [GATE_LAUNCH]: true,
  [GATE_PAYMENT]: true,
  [GATE_VIEW_MNEMONIC]: true
}

const validFields = [
  SEQUENCE,
  GATE_LAUNCH,
  GATE_PAYMENT,
  GATE_VIEW_MNEMONIC
]

const validate = (fields) => 
  fields.filter((i) => !validFields.includes(i)).length === 0

const serialize = (data) => encryption.encryptText(JSON.stringify(data), DATABASE_PATH)
const deserialize = (data) => data && data.pin !== ''
  ? { ...JSON.parse(encryption.decryptText(data.pin, DATABASE_PATH)), exists: true }
  : { exists: false }


export const get = () => new Promise((resolve, reject) => 
  db.findOne(documentType, (err, doc) => {
    if (err) {
      reject(err)
      return
    }

    const deserialized = deserialize(doc)

    resolve(deserialized)
  }))

export const set = (data) => new Promise((resolve, reject) => {
  if (!validate(Object.keys(data))) {
    reject('Invalid fields in object: ', data)
    return
  }

  get().then((currPIN) => {
    let updatedPIN = {}
    
    if (Object.keys(currPIN).length !== 0) {
      updatedPIN = { ...currPIN, ...data }
    } else {
      updatedPIN = { ...defaultPIN, ...data }
    }

    const pin = serialize(updatedPIN)
    
    db.update(documentType, { $set: { pin }}, { returnUpdatedDocs: true, multi: false }, (err, numReplaced, affectedDocuments) => {
      if (err) {
        reject(err)
        return
      }

      resolve(deserialize(affectedDocuments))
    })
  }).catch((err) => reject(err))
})

export const getPIN = () => get().then(({ sequence }) => sequence)
export const setPIN = (pin) => set({ [SEQUENCE]: pin })