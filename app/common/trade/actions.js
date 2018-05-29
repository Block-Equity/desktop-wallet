import * as Types from './types'
import { getOrderBook, manageOffer } from '../../services/networking/horizon'
import { getCurrentAccount } from '../account/selectors'
import { getUserPIN } from '../../db'
import * as encryption from '../../services/security/encryption'

const POLL_FREQUENCY = 30000
var pollOrderBook

export function fetchStellarOrderBook(sellingAsset, sellingAssetIssuer, buyingAsset, buyingAssetIssuer) {
  return async dispatch => {
    dispatch(fetchStellarOrderBookRequest())
    try {
      clearInterval(pollOrderBook)
      pollOrderBook = setInterval( async function() {
        const { payload, error, errorMessage } = await getOrderBook(sellingAsset, sellingAssetIssuer, buyingAsset, buyingAssetIssuer)
        if (error) {
          return dispatch(fetchStellarOrderBookFailure(errorMessage))
        }
        return dispatch(fetchStellarOrderBookSuccess(payload))
      }, POLL_FREQUENCY)
      const { payload, error, errorMessage } = await getOrderBook(sellingAsset, sellingAssetIssuer, buyingAsset, buyingAssetIssuer)
      if (error) {
        return dispatch(fetchStellarOrderBookFailure(errorMessage))
      }
      return dispatch(fetchStellarOrderBookSuccess(payload))
    } catch (e) {
      return dispatch(fetchStellarOrderBookFailure(e))
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

export function makeTradeOffer(sellingAsset, sellingAssetIssuer, buyingAsset, buyingAssetIssuer, amount, price) {
  return async (dispatch, getState) => {
    dispatch(makeTradeOfferRequest())
    //Fetch PIN
    let currentAccount = getCurrentAccount(getState())
    const { pKey: publicKey, sKey: secretKey } = currentAccount
    const { pin } = await getUserPIN()
    const decryptSK = await encryption.decryptText(secretKey, pin)
    try {
      const trade = await manageOffer(sellingAsset, sellingAssetIssuer, buyingAsset, buyingAssetIssuer, amount, price, decryptSK, publicKey)
      dispatch(makeTradeOfferSuccess(trade))
    } catch (e) {
      dispatch(makeTradeOfferFailure(e))
    }
  }
}

export function makeTradeOfferRequest() {
  return {
    type: Types.TRADE_STELLAR_REQUEST
  }
}

export function makeTradeOfferSuccess(trade) {
  return {
    type: Types.TRADE_STELLAR_SUCCESS,
    payload: trade
  }
}

export function makeTradeOfferFailure(error) {
  return {
    type: Types.TRADE_STELLAR_SUCCESS,
    payload: error,
    error: true
  }
}