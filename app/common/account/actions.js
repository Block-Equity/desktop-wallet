import * as db from '../../db'
import { getCurrentAccount, getAccounts } from './selectors'
import * as horizon from '../../services/networking/horizon'
import { getSupportedAssets } from '../../services/networking/lists'
import * as mnemonic from '../../services/security/mnemonic'
import * as Types from './types'

export function initializeDB () {
  return async dispatch => {
    dispatch(accountInitializationRequest())

    try {
      let { accounts } = await db.initialize()
      dispatch(setAccounts(accounts))
      const currentAccount = accounts[Object.keys(accounts)[0]]
      var modCurrentAccount
      if ('balances' in currentAccount) {
        currentAccount.balances.map(n => {
          //Get balance for XLM
          if (n.asset_type === 'native') {
            modCurrentAccount = {
              pKey: currentAccount.pKey,
              sKey: currentAccount.sKey,
              sequence: currentAccount.sequence,
              balance: n.balance,
              asset_type: n.asset_type,
              asset_name: 'Stellar',
              asset_code: 'XLM'
            }
          }
        })
      } else {
        modCurrentAccount = {
          pKey: currentAccount.pKey,
          sKey: currentAccount.sKey,
          balance: '0',
          sequence: '0',
          asset_type: ''
        }
      }

      dispatch(setCurrentAccount(modCurrentAccount))

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
    const currentAccount = getCurrentAccount(getState())
    const { pKey: publicKey, sKey: secretKey } = currentAccount
    dispatch(accountDetailsRequest())

    try {
      let details = await horizon.getAccountDetail(publicKey)
      const { balances, sequence: nextSequence, type } = details

      //Update current account info
      var updateCurrentAccount = {
        pKey: currentAccount.pKey,
        sKey: currentAccount.sKey,
        sequence: nextSequence
      }
      balances.map(n => {
        if (currentAccount.asset_type.length === 0) {
          //First check if initial account's asset type is not set
          //Set to native
          if (n.asset_type === 'native') {
            updateCurrentAccount = {
              ...updateCurrentAccount,
              balance: n.balance,
              asset_type: n.asset_type,
              asset_code: 'XLM',
              asset_name: 'Stellar'
            }
          }
        } else {
          //If account asset type is set, update other properties
          updateCurrentAccount = {
            ...updateCurrentAccount,
            balance: n.balance,
            asset_type: n.asset_type === currentAccount.asset_type ? currentAccount.asset_type : n.asset_type,
            asset_code: n.asset_type === 'native' ? 'XLM' : n.asset_code,
            asset_name: n.asset_type === 'native' ? 'Stellar' : ''
          }
        }
      })

      dispatch(setCurrentAccount(updateCurrentAccount))

      //Update Database
      const accounts = await db.updateUserAccount({
        publicKey,
        secretKey,
        balances,
        sequence: nextSequence,
        type
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
      const { list, response } = await getSupportedAssets()
      return dispatch(supportedAssetsSuccess(list, response))
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

export function supportedAssetsSuccess (list, response) {
  return {
    type: Types.ACCOUNT_SUPPORTED_ASSETS_SUCCESS,
    payload: { list, response }
  }
}

export function supportedAssetsFailure (error) {
  return {
    type: Types.ACCOUNT_SUPPORTED_ASSETS_FAILURE,
    payload: error,
    error: true
  }
}
