import { getExchangeDirectory } from '../../services/networking/lists'
import * as Types from './types'

export function fetchExchangeList () {
  return async (dispatch, getState) => {
    dispatch(supportedAssetsRequest())
    try {
      const { list, response } = await getExchangeDirectory()
      return dispatch(supportedAssetsSuccess(list, response))
    } catch (e) {
      return dispatch(supportedAssetsFailure(e))
    }
  }
}

export function exchangeListRequest () {
  return {
    type: Types.EXCHANGE_DIRECTORY_REQUEST
  }
}

export function exchangeListSuccess (list, response) {
  return {
    type: Types.EXCHANGE_DIRECTORY_SUCCESS,
    payload: { list, response }
  }
}

export function exchangeListFailure (error) {
  return {
    type: Types.EXCHANGE_DIRECTORY_FAILURE,
    payload: error,
    error: true
  }
}

