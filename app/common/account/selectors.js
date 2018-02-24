export function getAccounts (state) {
  return state.account.accounts
}

export function getCurrentAccount (state) {
  const { account: { currentAccountId, accounts } } = state
  if (accounts && currentAccountId) {
    return accounts[currentAccountId]
  }

  return undefined
}

export function getCurrentAccountDetails (state) {
  return state.account.currentAccountDetails
}
