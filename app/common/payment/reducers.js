import { createReducer } from '../utils'
import * as Types from './types'

export const INITIAL_STATE = {
  isSending: false,
  paymentFailed: false,
  payments: {}
}

function paymentSendRequest (state) {
  return {
    ...state,
    isSending: true,
    paymentFailed: false
  }
}

function paymentSendSuccess (state, payload) {
  const { payments } = state
  const { payment } = payload
  return {
    ...state,
    payments: {
      ...payments,
      [payment.destination]: payment
    },
    isSending: false,
    paymentFailed: false
  }
}

function paymentSendFailure (state, error) {
  return {
    ...state,
    paymentFailed: true,
    isSending: false,
    error
  }
}

const reducers = {
  [Types.PAYMENT_SEND_REQUEST]: paymentSendRequest,
  [Types.PAYMENT_SEND_SUCCESS]: paymentSendSuccess,
  [Types.PAYMENT_SEND_FAILURE]: paymentSendFailure
}

export default createReducer(INITIAL_STATE, reducers)
