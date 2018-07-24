import * as db from '../../db'
import {
  getCurrentAccount,
  getAccounts,
  getSupportedStellarAssets,
  getStellarAssetsForDisplay
} from './selectors'
import { getStellarPaymentPagingToken } from '../payment/selectors'
import {
  fetchPaymentOperationList,
  updatePaymentPagingToken
} from '../payment/actions'
import * as horizon from '../../services/networking/horizon'
import { getUserPIN } from '../../db'
import { getSupportedAssets } from '../../services/networking/lists'
import * as encryption from '../../services/security/encryption'
import * as Types from './types'

export const stellarAssetImageURL = 'https://firebasestorage.googleapis.com/v0/b/blockeq-wallet.appspot.com/o/icon-stellar.png?alt=media&token=38b70165-5255-4113-a15e-3c72bd4fab9f'
export const MINIMUM_BALANCE_INCREMENT = 0.5

export function initializeDB () {
  return async (dispatch, getState) => {
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
              asset_code: 'XLM',
              inflationDestination: currentAccount.inflationDestination
            }
          }
        })
      } else {
        modCurrentAccount = {
          pKey: currentAccount.pKey,
          sKey: currentAccount.sKey,
          balance: '0',
          minimumBalance: '0',
          sequence: '0',
          asset_type: ''
        }
      }

      dispatch(setCurrentAccount(modCurrentAccount))
      await dispatch(updatePaymentPagingToken(currentAccount.pagingToken))

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
    const supportedStellarAccounts = getSupportedStellarAssets(getState())
    const token = getStellarPaymentPagingToken(getState())
    dispatch(accountDetailsRequest())

    try {
      let details = await horizon.getAccountDetail(publicKey)
      const { balances, sequence: nextSequence, type, inflationDestination, subentryCount, signers } = details

      //Update current account info
      var updateCurrentAccount
      var amount

      const minimumBalance = calculateStellarMinimumBalance({ balances, sequence: nextSequence, type, inflationDestination, subentryCount, signers })

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
        minimumBalance,
        sequence: nextSequence,
        balance: amount,
        inflationDestination
      }
      dispatch(setCurrentAccount(updateCurrentAccount))

      //Update Database
      const accounts = await db.updateUserAccount({
        publicKey,
        secretKey,
        balances,
        sequence: nextSequence,
        type,
        inflationDestination,
        pagingToken: token,
        subentryCount,
        signers
      })
      dispatch(setAccounts(accounts))

      //Update Payment Operation list
      dispatch(fetchPaymentOperationList())

      if (!supportedStellarAccounts) {
        await dispatch(fetchSupportedAssets())
      }

      await dispatch(fetchStellarAssetsForDisplay())
      dispatch(fetchBlockEQTokensForDisplay())

      return dispatch(accountDetailsSuccess())
    } catch (e) {
      return dispatch(accountDetailsFailure(e))
    }

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
        asset_code: 'XLM',
        inflationDestination: ''
      }

      Object.keys(accounts).map((key, index) => {
        if (accounts[key].type === stellarAssetDesc.asset_name) {
          const stellarAccount = accounts[Object.keys(accounts)[index]]
          const minimumBalance = calculateStellarMinimumBalance(stellarAccount)
          stellarAccount.balances.map((acc, index) => {
            const assetCodeLookUpValue = acc.asset_code === undefined ? '' : acc.asset_code.toLowerCase()
            const checkIfDisplayNameExists = response[assetCodeLookUpValue] === undefined ? acc.asset_code : response[assetCodeLookUpValue].asset_name
            const checkIfIconURLExists = response[assetCodeLookUpValue] === undefined ? stellarAssetImageURL : response[assetCodeLookUpValue].asset_image
            const displayAccount = {
              asset_type: acc.asset_type,
              balance: acc.balance,
              minimumBalance,
              asset_code: acc.asset_type === stellarAssetDesc.asset_type ? stellarAssetDesc.asset_code : acc.asset_code,
              asset_name: acc.asset_type === stellarAssetDesc.asset_type ? stellarAssetDesc.asset_name : checkIfDisplayNameExists,
              asset_issuer: acc.asset_type === stellarAssetDesc.asset_type ? '' : acc.asset_issuer,
              asset_image: acc.asset_type === stellarAssetDesc.asset_type ? stellarAssetImageURL : checkIfIconURLExists,
              pKey: stellarAccount.pKey,
              sKey: stellarAccount.sKey,
              sequence: stellarAccount.sequence,
              inflationDestination: acc.asset_type === stellarAssetDesc.asset_type ? stellarAccount.inflationDestination : ''
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

export function calculateStellarMinimumBalance(stellarAccount) {
  const baseReserve = 0.5

  const trustlines = {
    count: stellarAccount.balances.length - 1,
    amount: (stellarAccount.balances.length - 1) * MINIMUM_BALANCE_INCREMENT
  }

  const offers = {
    count: stellarAccount.subentryCount - trustlines.count,
    amount: (stellarAccount.subentryCount - trustlines.count) * MINIMUM_BALANCE_INCREMENT
  }

  const signers = {
    count: stellarAccount.signers ? stellarAccount.signers.length : 0,
    amount: (stellarAccount.signers ? stellarAccount.signers.length : 0) * MINIMUM_BALANCE_INCREMENT
  }

  const minimumBalanceAmount = baseReserve + trustlines.amount + offers.amount + signers.amount

  const minimumBalance = {
    baseReserve,
    trustlines,
    offers,
    signers,
    minimumBalanceAmount
  }

  return minimumBalance
}

export function fetchBlockEQTokensForDisplay () {
  return async (dispatch, getState) => {
    try {
      const supportedStellarAssets = getSupportedStellarAssets(getState())
      const { list, response } = supportedStellarAssets
      const stellarAccounts = getStellarAssetsForDisplay(getState())
      var supportedDisplayAssetsObj = { ...response }
      for (var j = 0; j < stellarAccounts.length; j ++ ) {
        const stellarAsset = stellarAccounts[j]
        if (stellarAsset.asset_type !== 'native') {
          const stellarAssetCode = stellarAsset.asset_code.toLowerCase()
          if (stellarAssetCode in response) {
            delete supportedDisplayAssetsObj[stellarAssetCode]
          }
        }
      }
      var supportedDisplayAssets = Object.keys(supportedDisplayAssetsObj).map(function (key) { return supportedDisplayAssetsObj[key] })
      return dispatch(blockEQTokensDisplaySuccess(stellarAccounts.length > 1 ? supportedDisplayAssets : list))
    } catch (e) {
      return dispatch(blockEQTokensDisplayFailure(e))
    }
  }
}

export function changeTrustOperation ( asset, removeTrust ) {
  return async (dispatch, getState) => {
    try {
      const currentAccount = getCurrentAccount(getState())
      const { pKey: publicKey, sKey: secretKey } = currentAccount

      const { pin } = await getUserPIN()
      const decryptSK = await encryption.decryptText(secretKey, pin)

      const { asset_issuer: issuerPK, asset_code: assetType } = asset
      console.log(`BlockEQ Asset: ${JSON.stringify(asset)}`)

      const { payload, error } = await horizon.changeTrust({decryptSK, publicKey, issuerPK, assetType, removeTrust})
      return(dispatch(changeTrustSuccess()))
    } catch (e) {
      return(dispatch(changeTrustFailure(e)))
    }
  }
}

export function joinInflationPoolOperation () {
  return async (dispatch, getState) => {
    try {
      const currentAccount = getCurrentAccount(getState())
      const { pKey: publicKey, sKey: secretKey } = currentAccount

      const { pin } = await getUserPIN()
      const decryptSK = await encryption.decryptText(secretKey, pin)

      const { payload, error } = await horizon.joinInflationDestination(decryptSK, publicKey)
      return(dispatch(joinInflationSuccess()))
    } catch (e) {
      return(dispatch(joinInflationFailure(e)))
    }
  }
}

export function joinInflationSuccess () {
  return {
    type: Types.JOIN_INFLATION_SUCCESS
  }
}

export function joinInflationFailure (error) {
  return {
    type: Types.JOIN_INFLATION_FAILURE,
    payload: error,
    error: true
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

export function changeTrustRequest () {
  return {
    type: Types.CHANGE_TRUST_REQUEST
  }
}

export function changeTrustSuccess () {
  return {
    type: Types.CHANGE_TRUST_SUCCESS,
    payload: 'success'
  }
}

export function changeTrustFailure (error) {
  return {
    type: Types.CHANGE_TRUST_FAILURE,
    payload: error,
    error
  }
}
