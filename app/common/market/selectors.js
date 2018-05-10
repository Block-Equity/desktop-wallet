export function getStellarMarketInfo (state) {
  return state.market.stellar
}

export function getStellarMarketCADPrice (state) {
  return state.market.stellar.quotes.CAD.price
}