import * as Types from './types'
import * as coinmarketcap from '../../services/networking/coinmarketcap'

export function fetchStellarMarketInfo() {
  return async dispatch => {
    dispatch(fetchStellarMarketInfoRequest())
    try {
      const pollMarket = setInterval( async function() {
        const { info } = await coinmarketcap.getStellarMarketInfo()
        return dispatch(fetchStellarMarketInfoSuccess(info))
      }, 240000)
      const { info } = await coinmarketcap.getStellarMarketInfo()
      return dispatch(fetchStellarMarketInfoSuccess(info))

    } catch (e) {
      return dispatch(fetchStellarMarketInfoFailure)
    }
  }
}

export function fetchStellarMarketInfoRequest () {
  return {
    type: Types.MARKET_STELLAR_INFO_REQUEST
  }
}

export function fetchStellarMarketInfoSuccess (info) {
  return {
    type: Types.MARKET_STELLAR_INFO_SUCCESS,
    payload: { info }
  }
}

export function fetchStellarMarketInfoFailure (error) {
  return {
    type: Types.MARKET_STELLAR_INFO_FAILURE,
    payload: error,
    error: true
  }
}