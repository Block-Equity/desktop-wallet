import { sendPayment, getPaymentOperationList, createDestinationAccount, BASE_URL_HORIZON_PUBLIC_NET } from '../../services/networking/horizon'
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

      // 4. And we're done!
      dispatch(paymentSendSuccess({
        destination,
        amount
      }))

      // 2. Fetch the account details to get the updated balance
      dispatch(fetchAccountDetails())


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
    try {
      let currentAccount = getCurrentAccount(getState())
      const { pKey } = currentAccount

      const url = `${BASE_URL_HORIZON_PUBLIC_NET}/accounts/${pKey}/payments`
      var es = new EventSource(url)
      es.onmessage = message => {
        var payload = message.data ? JSON.parse(message.data) : message
        console.log(`Incoming Payment Obj: ${JSON.stringify(payload)}`)

        dispatch(streamPaymentIncoming(true))

        if (payload.from !== undefined) {
          if (payload.from !== pKey) {
            const currency = payload.asset_type === 'native' ? 'XLM' : payload.asset_code
            new Notification('Payment Received',
              { body: `You have received ${payload.amount} ${currency} from ${payload.from}`}
            )
            dispatch(fetchAccountDetails())
          }
        }

        return dispatch(streamPaymentSuccess(payload))
      }
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

