import { initializeDb } from '../db'
import { createAccount } from '../services/networking/horizon'
import { unlock, lock, destroy } from '../services/authentication/locking'

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
    await unlock({ password: 'd6F3Efeq' })

    // TODO: simply here for dubugging purposes
    if (process.env.NODE_ENV === 'development') {
      global.DATABASE = { unlock, lock, destroy }
    }

    let { accounts, exists } = await initializeDb()

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
