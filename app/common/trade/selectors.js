export function getStellarOrderBook (state) {
  return state.trade.orderbook
}

export function getStellarOpenOrders (state) {
  return state.trade.openOrders
}

export function getStellarTradeHistory (state) {
  return state.trade.history
}