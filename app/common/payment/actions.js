import { sendPayment } from '../../services/networking/horizon'
import { fetchAccountDetails } from '../account/actions'
import { getCurrentAccount } from '../account/selectors'
import * as Types from './types'

export function sendPaymentToAddress ({ destination, amount }) {
  return async (dispatch, getState) => {
    const currentAccount = getCurrentAccount(getState())

    const {
      pKey: publicKey,
      sKey: secretKey,
      sequence
    } = currentAccount

    dispatch(paymentSendRequest())

    try {
      await sendPayment({
        publicKey,
        secretKey,
        sequence,
        destinationId: destination,
        amount
      })

      await fetchAccountDetails(currentAccount)

      return dispatch(paymentSendSuccess({
        destination,
        amount
      }))
    } catch (e) {
      return dispatch(paymentSendFailure(e))
    }
  }
}

export function paymentSendRequest () {
  return {
    type: Types.PAYMENT_SEND_REQUEST
  }
}

export function paymentSendSuccess (payment) {
  return {
    type: Types.PAYMENT_SEND_SUCCESS,
    payload: payment
  }
}

export function paymentSendFailure (error) {
  return {
    type: Types.PAYMENT_SEND_FAILURE,
    payload: error,
    error: true
  }
}
