import {
  initializeDb,
  updateUserAccountToDB
} from '../../db'

import {
  createAccount,
  getAccountDetail
} from '../../services/networking/horizon'

import { unlock, lock, destroy } from '../../services/authentication/locking'

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
      dispatch(accountCreationRequest())

      try {
        accounts = await createAccount()
        dispatch(accountCreationSuccess())
      } catch (e) {
        return dispatch(accountCreationFailure(e))
      }
    }

    dispatch(setAccounts(accounts))

    return dispatch(setCurrentAccountId(Object.keys(accounts)[0]))
  }
}

export function fetchAccountDetails (account) {
  return async dispatch => {
    dispatch(accountDetailsRequest())

    let details

    try {
      const { pKey: publicKey, sKey: secretKey } = account

      details = await getAccountDetail(publicKey)

      const { balance, sequence: nextSequence } = details

      const accounts = await updateUserAccountToDB({
        publicKey,
        secretKey,
        balance,
        sequence: nextSequence
      })

      dispatch(setAccounts(accounts))
    } catch (e) {
      return dispatch(accountDetailsFailure())
    }

    return dispatch(accountDetailsSuccess(details))
  }
}

export function accountCreationRequest () {
  return {
    type: 'account/ACCOUNT_CREATION_REQUEST'
  }
}

export function accountCreationSuccess () {
  return {
    type: 'account/ACCOUNT_CREATION_SUCCESS'
  }
}

export function accountCreationFailure (error) {
  return {
    type: 'account/ACCOUNT_CREATION_FAILURE',
    payload: error,
    error: true
  }
}

export function setAccounts (accounts) {
  return {
    type: 'account/ACCOUNTS',
    payload: accounts
  }
}

export function setCurrentAccountId (accountId) {
  return {
    type: 'account/CURRENT_ACCOUNT',
    payload: accountId
  }
}

export function accountDetailsRequest () {
  return {
    type: 'account/ACCOUNT_DETAILS_REQUEST'
  }
}

export function accountDetailsSuccess (details) {
  return {
    type: 'account/ACCOUNT_DETAILS_SUCCESS',
    payload: details
  }
}

export function accountDetailsFailure (error) {
  return {
    type: 'account/ACCOUNT_DETAILS_FAILURE',
    payload: error,
    error: true
  }
}
