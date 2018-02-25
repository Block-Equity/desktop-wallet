import {
  initializeDb,
  updateUserAccountToDB
} from '../../db'

import {
  createAccount,
  getAccountDetail
} from '../../services/networking/horizon'

import * as Types from './types'

export function initializeAccount () {
  return async dispatch => {
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

    return dispatch(setAccounts(accounts))
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
      return dispatch(accountDetailsFailure(e))
    }

    return dispatch(accountDetailsSuccess(details))
  }
}

export function accountCreationRequest () {
  return {
    type: Types.ACCOUNT_CREATION_REQUEST
  }
}

export function accountCreationSuccess () {
  return {
    type: Types.ACCOUNT_CREATION_SUCCESS
  }
}

export function accountCreationFailure (error) {
  return {
    type: Types.ACCOUNT_CREATION_FAILURE,
    payload: error,
    error: true
  }
}

export function setAccounts (accounts) {
  return {
    type: Types.SET_ACCOUNTS,
    payload: { accounts }
  }
}

export function setCurrentAccountId (accountId) {
  return {
    type: Types.SET_CURRENT_ACCOUNT,
    payload: { accountId }
  }
}

export function accountDetailsRequest () {
  return {
    type: Types.ACCOUNT_DETAILS_REQUEST
  }
}

export function accountDetailsSuccess (details) {
  return {
    type: Types.ACCOUNT_DETAILS_SUCCESS,
    payload: { details }
  }
}

export function accountDetailsFailure (error) {
  return {
    type: Types.ACCOUNT_DETAILS_FAILURE,
    payload: error,
    error: true
  }
}
