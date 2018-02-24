export default function createReducer (INITIAL_STATE, reducers) {
  return (state = INITIAL_STATE, action) => {
    let reducer = reducers[action.type]
    let result = reducer ? reducer(state, action.payload) : state
    console.log('state', result)
    return result
  }
}
