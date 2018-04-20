import * as db from '../../db'
import {
  getCurrentAccount,
  getAccounts,
  getSupportedStellarAssets,
  getStellarAssetsForDisplay,
  getBlockEQTokensForDisplay
} from './selectors'
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
      var updateCurrentAccount
      var amount

      balances.map(n => {
        if (currentAccount.asset_type === 'native') {
          amount = n.balance
        } else {
          if (currentAccount.asset_code === n.asset_code)
            amount = n.balance
        }
      })
      updateCurrentAccount = {
        ...currentAccount,
        sequence: nextSequence,
        balance: amount,
      }
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

export function fetchStellarAssetsForDisplay () {
  return async (dispatch, getState) => {
    try {
      const accounts = getAccounts(getState())
      const supportedStellarAccounts = getSupportedStellarAssets(getState())
      const { response } = supportedStellarAccounts
      var stellarAccounts = []

      const stellarAssetDesc = {
        asset_order: 0,
        asset_type: 'native',
        asset_name: 'Stellar',
        asset_code: 'XLM'
      }

      Object.keys(accounts).map((key, index) => {
        if (accounts[key].type === stellarAssetDesc.asset_name) {
          const stellarAccount = accounts[Object.keys(accounts)[index]]
          stellarAccount.balances.map((acc, index) => {
            const displayAccount = {
              asset_type: acc.asset_type,
              balance: acc.balance,
              asset_code: acc.asset_type === stellarAssetDesc.asset_type ? stellarAssetDesc.asset_code : acc.asset_code,
              asset_name: acc.asset_type === stellarAssetDesc.asset_type ? stellarAssetDesc.asset_name : response[acc.asset_code.toLowerCase()].asset_name,
              asset_issuer: acc.asset_type === stellarAssetDesc.asset_type ? '' : acc.asset_issuer,
              pKey: stellarAccount.pKey,
              sKey: stellarAccount.sKey,
              sequence: stellarAccount.sequence
            }

            if (acc.asset_type === stellarAssetDesc.asset_type) {
              stellarAccounts.splice(stellarAssetDesc.asset_order, 0, displayAccount)
            } else {
              stellarAccounts.push(displayAccount)
            }
          })
        }
      })

      return dispatch(stellarAccountsDisplaySuccess(stellarAccounts))
    } catch (e) {
      return dispatch(stellarAccountsDisplayFailure(e))
    }
  }
}

export function fetchBlockEQTokensForDisplay () {
  return async (dispatch, getState) => {
    try {
      const supportedStellarAssets = getSupportedStellarAssets(getState())
      const { list } = supportedStellarAssets
      const stellarAccounts = getStellarAssetsForDisplay(getState())
      var supportedDisplayAssets = []

      for (var i = 0; i < list.length; i ++ ) {
        const supportedAsset = list[i]
        for (var j = 0; j < stellarAccounts.length; j ++ ) {
          const stellarAsset = stellarAccounts[j]
          if (stellarAsset.asset_type !== 'native')
            if (supportedAsset.asset_code !== stellarAsset.asset_code)
              supportedDisplayAssets.push(supportedAsset)
        }
      }

      console.log(`Action Supported Display Asset: ${JSON.stringify(supportedDisplayAssets)}`)

      return dispatch(blockEQTokensDisplaySuccess(supportedDisplayAssets))
    } catch (e) {
      return dispatch(blockEQTokensDisplayFailure(e))
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

export function stellarAccountsDisplaySuccess (accounts) {
  return {
    type: Types.STELLAR_ACCOUNTS_DISPLAY_SUCCESS,
    payload: { accounts }
  }
}

export function stellarAccountsDisplayFailure (error) {
  return {
    type: Types.STELLAR_ACCOUNTS_DISPLAY_FAILURE,
    payload: error,
    error: true
  }
}

export function blockEQTokensDisplaySuccess (accounts) {
  return {
    type: Types.BLOCKEQ_TOKENS_DISPLAY_SUCCESS,
    payload: { accounts }
  }
}

export function blockEQTokensDisplayFailure (error) {
  return {
    type: Types.BLOCKEQ_TOKENS_DISPLAY_FAILURE,
    payload: error,
    error: true
  }
}
