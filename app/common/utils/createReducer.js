export default function createReducer (INITIAL_STATE, reducers) {
  return (state = INITIAL_STATE, action) => {
    let reducer = reducers[action.type]
    return reducer ? reducer(state, action.payload) : state
  }
}
