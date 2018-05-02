import has from 'lodash/has'

export function getAccounts (state) {
  return state.account.accounts
}

export function getCurrentAccount (state) {
  const { account: { currentAccount } } = state
  return currentAccount
}

export function getAccountByPublicKey (state, publicKey) {
  const accounts = getAccounts(state)
  if (!has(accounts, publicKey)) {
    return undefined
  }

  return accounts[publicKey]
}

export function getSupportedStellarAssets (state) {
  return state.account.supportedAssets
}

export function getStellarAssetsForDisplay (state) {
  return state.account.stellarAssetsDisplay
}

export function getBlockEQTokensForDisplay (state) {
  return state.account.blockeqTokensDisplay
}

export function getUserAccountFailedStatus (state) {
  return state.account.fetchingFailed
}