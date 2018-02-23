import { initializeDb } from '../store/datastore'
import { createAccount } from '../network/horizon'
import { Storage } from '../common/security'

export const USER_ACCOUNT = 'USER_ACCOUNT'
export const CURRENT_USER_WALLET = 'CURRENT_USER_WALLET'

export function initializeAccount () {
  return async dispatch => {
    // TODO: password will be passed in accordingly
    //
    // It will be composed of:
    // (a) email/username
    // (b) password
    // (c) 2FA code
    // (d) a key (from the keychain)
    //
    // This will eventually be fetched via another module. For now, assume the password
    // is the following:
    let storage = new Storage({ password: 'd6F3Efeq' })

    // TODO: simply here for dubugging purposes
    if (process.env.NODE_ENV === 'development') {
      global.STORAGE = storage
    }

    let db = await storage.unlock()

    let { accounts, exists } = await initializeDb(db)

    // If it was just created (so it didn't exist), create an account
    if (!exists) {
      try {
        accounts = await createAccount()
      } catch (e) {
      // TODO: dispatch an error
        return e
      }
    }

    dispatch(setUserAccount(accounts))
    dispatch(setCurrentUserWallet(Object.keys(accounts)[0]))

    return Promise.resolve()
  }
}

export function setUserAccount (accounts) {
  return {
    type: USER_ACCOUNT,
    payload: accounts
  }
}

export function setCurrentUserWallet (accountID) {
  return {
    type: CURRENT_USER_WALLET,
    payload: accountID
  }
}
