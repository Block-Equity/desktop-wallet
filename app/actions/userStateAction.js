import { initializeDb } from '../store/datastore'
import { createAccount } from '../network/horizon'

export const USER_ACCOUNT = 'USER_ACCOUNT'
export const CURRENT_USER_WALLET = 'CURRENT_USER_WALLET'

export function initializeAccount () {
  return (dispatch) => {
    (async () => {
      let { accounts, exists } = await initializeDb()

      // If it was just created (so it didn't exist), create an account
      if (!exists) {
        try {
          accounts = await createAccount()
        } catch (e) {
          // TODO: dispatch an error
        }
      }

      dispatch(setUserAccount(accounts))
      dispatch(setCurrentUserWallet(Object.keys(accounts)[0]))
    })()
  }
}

export function setUserAccount (accounts) {
  return {
    type: USER_ACCOUNT,
    payload: accounts
  }
}

export function setCurrentUserWallet (accountID) {
  return {
    type: CURRENT_USER_WALLET,
    payload: accountID
  }
}
