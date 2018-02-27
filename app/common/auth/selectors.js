export function getAuthToken (state) {
  return state.auth.token
}

export function isAuthenticated (state) {
  return state.auth.isAuthenticated
}
