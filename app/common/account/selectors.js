export function getAccounts (state) {
  return state.account.accounts
}

export function getCurrentAccount (state) {
  const { account: { currentAccount } } = state
  return currentAccount
}
