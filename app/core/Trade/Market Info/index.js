import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'

import { getStellarMarketInfo } from '../../../common/market/selectors'
import { fetchStellarOrderBook } from '../../../common/trade/actions'
import { getStellarOrderBook } from '../../../common/trade/selectors'

import styles from './style.css'

class MarketInfo extends Component {

  render() {

  }

}

const mapStateToProps = (state) => {
  return {
    stellarMarketInfo: getStellarMarketInfo(state),
    stellarOrderBook: getStellarOrderBook(state)
  }
}

export default connect(
  mapStateToProps, {
    fetchStellarOrderBook
}) (MarketInfo)