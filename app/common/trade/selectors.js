export function getStellarOrderBook (state) {
  return state.trade.orderbook
}

export function getBestOffer (state) {
  return state.trade.bestOffer
}

export function getStellarOpenOrders (state) {
  return state.trade.openOrders
}

export function getStellarTradeHistory (state) {
  return state.trade.history
}