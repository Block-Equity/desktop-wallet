export function getIncomingPayment (state) {
  return state.payment.incomingPaymentMessage
}

export function getPaymentTransactions (state) {
  return state.payment.paymentTransactions
}

export function getSendPaymentStatus (state) {
  return state.payment.isSending
}

export function getStellarPaymentPagingToken (state) {
  return state.payment.stellarPagingToken
}