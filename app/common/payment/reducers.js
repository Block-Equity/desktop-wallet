import { createReducer } from '../utils'
import * as Types from './types'

export const INITIAL_STATE = {
  isSending: false,
  paymentFailed: false,
  payments: {},
  isPaymentTransactionsFetching: false, //tooo long
  paymentTransactionsFailed: false,
  paymentTransactions: [] //TODO: This is a duplication of payments
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

function paymentOperationListRequest (state) {
  return {
    ...state,
    isPaymentTransactionsFetching: true,
    paymentTransactionsFailed: false
  }
}

function paymentOperationListSuccess (state, payload) {
  const { paymentTransactions } = state
  const { list } = payload
  return {
    ...state,
    paymentTransactions: list,
    isPaymentTransactionsFetching: false,
    paymentTransactionsFailed: false
  }
}

function paymentOperationListFailure (state, error) {
  return {
    ...state,
    paymentTransactionsFailed: true,
    isPaymentTransactionsFetching: false,
    error
  }
}

const paymentSendReducers = {
  [Types.PAYMENT_SEND_REQUEST]: paymentSendRequest,
  [Types.PAYMENT_SEND_SUCCESS]: paymentSendSuccess,
  [Types.PAYMENT_SEND_FAILURE]: paymentSendFailure
}

const paymentTransactionReducers = {
  [Types.PAYMENT_LIST_REQUEST]: paymentTransactionsRequest,
  [Types.PAYMENT_LIST_SUCCESS]: paymentTransactionsSuccess,
  [Types.PAYMENT_LIST_FAILURE]: paymentTransactionsFailure
}

export default createReducer(INITIAL_STATE, {...paymentSendReducers, ...paymentTransactionReducers})
