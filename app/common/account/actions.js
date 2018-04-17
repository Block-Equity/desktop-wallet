import * as db from '../../db'
import { getCurrentAccount } from './selectors'
import * as horizon from '../../services/networking/horizon'
import { getSupportedAssets } from '../../services/networking/lists'
import * as mnemonic from '../../services/security/mnemonic'
import * as Types from './types'

export function initializeDB () {
  return async dispatch => {
    dispatch(accountInitializationRequest())

    try {
      let { accounts } = await db.initialize()
      const updatedCurrentAccount = accounts[Object.keys(accounts)[0]]
      dispatch(setAccounts(accounts))
      dispatch(setCurrentAccount(updatedCurrentAccount))

      return dispatch(accountInitializationSuccess(accounts))
    } catch (e) {
      return dispatch(accountInitializationFailure(e))
    }
  }
}

export function addWalletToDB (wallet) {
  return async dispatch => {
    dispatch(accountInitializationRequest())

    try {
      let accounts = await db.addUserAccount(wallet)

      return dispatch(accountInitializationSuccess(accounts))
    } catch (e) {
      return dispatch(accountInitializationFailure(e))
    }
  }
}

export function fundAccount ({ publicKey, secretKey }) {
  return async dispatch => {
    dispatch(accountCreationRequest())

    let accounts = null

    try {
      accounts = await horizon.fundAccount(publicKey)
      const { balance, sequence } = accounts

      await db.addUserAccount({
        publicKey,
        secretKey,
        balance,
        sequence
      })

      dispatch(accountCreationSuccess())
    } catch (e) {
      return dispatch(accountCreationFailure(e))
    }

    return dispatch(setAccounts(accounts))
  }
}

export function fetchAccountDetails () {
  return async (dispatch, getState) => {
    let currentAccount = getCurrentAccount(getState())
    const { pKey: publicKey, sKey: secretKey } = currentAccount
    dispatch(accountDetailsRequest())

    try {
      let details = await horizon.getAccountDetail(publicKey)

      const { balance, sequence: nextSequence } = details

      const accounts = await db.updateUserAccount({
        publicKey,
        secretKey,
        balance,
        sequence: nextSequence
      })

      dispatch(setAccounts(accounts))
    } catch (e) {
      return dispatch(accountDetailsFailure(e))
    }

    return dispatch(accountDetailsSuccess())
  }
}

export function fetchSupportedAssets () {
  return async (dispatch, getState) => {
    dispatch(supportedAssetsRequest())

    try {
      const { list } = await getSupportedAssets()
      return dispatch(supportedAssetsSuccess(list))
    } catch (e) {
      return dispatch(supportedAssetsFailure(e))
    }
  }
}

export function accountInitializationRequest () {
  return {
    type: Types.ACCOUNT_INITIALIZATION_REQUEST
  }
}

export function accountInitializationSuccess (accounts) {
  return {
    type: Types.ACCOUNT_INITIALIZATION_SUCCESS,
    payload: { accounts }
  }
}

export function accountInitializationFailure (error) {
  return {
    type: Types.ACCOUNT_INITIALIZATION_FAILURE,
    payload: error,
    error: true
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

export function setCurrentAccount (account) {
  return {
    type: Types.SET_CURRENT_ACCOUNT,
    payload: { account }
  }
}

export function accountDetailsRequest () {
  return {
    type: Types.ACCOUNT_DETAILS_REQUEST
  }
}

export function accountDetailsSuccess () {
  return {
    type: Types.ACCOUNT_DETAILS_SUCCESS
  }
}

export function accountDetailsFailure (error) {
  return {
    type: Types.ACCOUNT_DETAILS_FAILURE,
    payload: error,
    error: true
  }
}

export function supportedAssetsRequest () {
  return {
    type: Types.ACCOUNT_SUPPORTED_ASSETS_REQUEST
  }
}

export function supportedAssetsSuccess (list) {
  return {
    type: Types.ACCOUNT_SUPPORTED_ASSETS_SUCCESS,
    payload: { list }
  }
}

export function supportedAssetsFailure (error) {
  return {
    type: Types.ACCOUNT_SUPPORTED_ASSETS_FAILURE,
    payload: error,
    error: true
  }
}
