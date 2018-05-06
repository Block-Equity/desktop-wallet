import { createReducer } from '../utils'
import * as Types from './types'

export const INITIAL_STATE = {
  appSelected: 0
}

export function setCurrentApp (state, payload) {
  return {
    ...state,
    appSelected: payload
  }
}

const reducers = {
  [Types.SET_CURRENT_APP]: setCurrentApp
}

export default createReducer(INITIAL_STATE, reducers)
