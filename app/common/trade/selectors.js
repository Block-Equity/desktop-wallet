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

export function getTradeStatus (state) {
  return state.trade.tradeError
}

export function getTradeErrorMessage (state) {
  return state.trade.tradeErrorMessage
}