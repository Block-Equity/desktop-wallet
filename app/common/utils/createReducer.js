import { stat } from "fs-extra-p"

export default function createReducer (INITIAL_STATE, reducers) {
  return (state = INITIAL_STATE, action) => {
    if (action.type === 'auth/logout') {
      console.log('Logout')
      state = undefined
      return state
    } else {
      let reducer = reducers[action.type]
      return reducer ? reducer(state, action.payload) : state
    }
  }
}
