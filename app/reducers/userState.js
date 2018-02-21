import { USER_ACCOUNT, CURRENT_USER_WALLET } from '../actions/userStateAction'

export function userState (state = { }, action) {
  if (action.type === USER_ACCOUNT) {
    return action.payload
  }
  return state
}

export function currentUserWallet (state = { }, action) {
  if (action.type === CURRENT_USER_WALLET) {
    return action.payload
  }
  return state
}
