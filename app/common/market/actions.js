import * as Types from './types'
import * as coinmarketcap from '../../services/networking/coinmarketcap'

const POLL_FREQUENCY = 300000 //5 minutes

export function fetchStellarMarketInfo() {
  return async dispatch => {
    dispatch(fetchStellarMarketInfoRequest())
    try {
      const pollMarket = setInterval( async function() {
        const { info } = await coinmarketcap.getStellarMarketInfo()
        return dispatch(fetchStellarMarketInfoSuccess(info))
      }, POLL_FREQUENCY)
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