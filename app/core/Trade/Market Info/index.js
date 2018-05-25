import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'

import styles from './style.css'

class MarketInfo extends Component {

  render() {

  }

}

const mapStateToProps = (state) => {
  return {
    assets: getStellarAssetsForDisplay(state),
    stellarMarketInfo: getStellarMarketInfo(state),
    stellarOrderBook: getStellarOrderBook(state)
  }
}

export default connect(
  mapStateToProps, {
    fetchStellarOrderBook
}) (MarketInfo)