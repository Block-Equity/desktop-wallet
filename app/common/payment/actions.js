import { sendPayment, getPaymentOperationList, receivePaymentStream, createDestinationAccount } from '../../services/networking/horizon'
import { fetchAccountDetails, setCurrentAccount, fetchStellarAssetsForDisplay } from '../account/actions'
import { getCurrentAccount, getAccountByPublicKey } from '../account/selectors'
import * as Types from './types'
import { getUserPIN } from '../../db'
import * as encryption from '../../services/security/encryption'

export function sendPaymentToAddress ({ destination, amount, memoID }) {
  return async (dispatch, getState) => {
    let currentAccount = getCurrentAccount(getState())

    const {
      pKey: publicKey,
      sKey: secretKey,
      sequence,
      asset_issuer: issuerPK,
      asset_code: assetType
    } = currentAccount

    console.log(`Send Payment Action: ${JSON.stringify(currentAccount)}`)

    const { pin } = await getUserPIN()
    const decryptSK = await encryption.decryptText(secretKey, pin)

    dispatch(paymentSendRequest())

    try {
      // 1. Start the payment process
      const { exists } = await sendPayment({
        publicKey,
        decryptSK,
        sequence,
        destinationId: destination,
        amount,
        memoID,
        issuerPK,
        assetType
      })

      if (!exists) {
        const { error, errorMessage } = await createDestinationAccount({decryptSK, publicKey, destination, amount, sequence})
        if (error) {
          return dispatch(paymentSendFailure(errorMessage))
        }
      }

      // 2. Fetch the account details to get the updated balance
      await dispatch(fetchAccountDetails())
      await dispatch(fetchStellarAssetsForDisplay())
      await dispatch(fetchPaymentOperationList())

      // 4. And we're done!
      return dispatch(paymentSendSuccess({
        destination,
        amount
      }))
    } catch (e) {
      console.log(`Send payment error: ${e}`)
      return dispatch(paymentSendFailure(e))
    }
  }
}

export function fetchPaymentOperationList() {
  return async (dispatch, getState) => {
    let currentAccount = getCurrentAccount(getState())

    const {
      pKey: publicKey,
    } = currentAccount

    dispatch(paymentOperationListRequest())

    try {
      let paymentList = await getPaymentOperationList(publicKey)
      return dispatch(paymentOperationListSuccess(paymentList))
    } catch (e) {
      return dispatch(paymentOperationListFailure(e))
    }
  }
}

export function streamPayments() {
  return async (dispatch, getState) => {
    let currentAccount = getCurrentAccount(getState())

    const {
      pKey: publicKey,
    } = currentAccount

    try {
      let incomingPayment = await receivePaymentStream(publicKey)
      console.log(`Incoming Payment Obj: ${JSON.stringify(incomingPayment)}`)

      dispatch(streamPaymentIncoming(true))

      //Update Account Details
      await dispatch(fetchAccountDetails())

      //Update Payment Operation list
      await dispatch(fetchPaymentOperationList())

      if (incomingPayment.from !== publicKey || incomingPayment.from !== undefined ) {
        const currency = incomingPayment.asset_type === 'native' ? XLM : incomingPayment.asset_code
        new Notification('Payment Received',
          { body: `You have received ${incomingPayment.amount} ${currency} from ${incomingPayment.from}`}
        )
      }

      //Finally, store incoming payment to local store
      return dispatch(streamPaymentSuccess(incomingPayment))
    } catch (e) {
      return dispatch(streamPaymentFailure(e))
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
    payload: { payment }
  }
}

export function paymentSendFailure (error) {
  return {
    type: Types.PAYMENT_SEND_FAILURE,
    payload: error,
    error: true
  }
}

export function paymentOperationListRequest () {
  return {
    type: Types.PAYMENT_OPERATION_LIST_REQUEST
  }
}

export function paymentOperationListSuccess (list) {
  return {
    type: Types.PAYMENT_OPERATION_LIST_SUCCESS,
    payload: { list }
  }
}

export function paymentOperationListFailure (error) {
  return {
    type: Types.PAYMENT_OPERATION_LIST_FAILURE,
    payload: error,
    error: true
  }
}

export function streamPaymentIncoming (incoming) {
  return {
    type: Types.PAYMENT_STREAMING_INCOMING,
    payload: incoming
  }
}

export function streamPaymentSuccess (message) {
  return {
    type: Types.PAYMENT_STREAMING_SUCCESS,
    payload: message
  }
}

export function streamPaymentFailure (error) {
  return {
    type: Types.PAYMENT_STREAMING_FAILURE,
    payload: error,
    error: true
  }
}

export function clearStreamPaymentMessage() {
  return {
    type: Types.PAYMENT_OPERATION_LIST_SUCCESS,
    payload: {}
  }
}

