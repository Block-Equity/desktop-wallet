import * as Types from './types'
import { getOrderBook } from '../../services/networking/horizon'
import { getCurrentAccount } from '../account/selectors'
import { getUserPIN } from '../../db'
import * as encryption from '../../services/security/encryption'

export function fetchStellarOrderBook(sellingAsset, buyingAsset) {
  return async dispatch => {
    dispatch(fetchStellarOrderBookRequest())

    let currentAccount = getCurrentAccount(getState())
    const { pKey: publicKey, sKey: secretKey } = currentAccount
    const { pin } = await getUserPIN()
    const decryptSK = await encryption.decryptText(secretKey, pin)

    try {
      const { payload, error } = getOrderBook(sellingAsset, buyingAsset, decryptSK, pKey)
      return dispatch(fetchStellarOrderBookSuccess(orderbook))
    } catch (e) {
      return dispatch(fetchStellarOrderBookFailure)
    }
  }
}

export function fetchStellarOrderBookRequest () {
  return {
    type: Types.TRADE_STELLAR_ORDER_BOOK_REQUEST
  }
}

export function fetchStellarOrderBookSuccess (orderbook) {
  return {
    type: Types.TRADE_STELLAR_ORDER_BOOK_SUCCESS,
    payload: { orderbook }
  }
}

export function fetchStellarOrderBookFailure (error) {
  return {
    type: Types.TRADE_STELLAR_ORDER_BOOK_FAILURE,
    payload: error,
    error: true
  }
}