import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'

import { fetchOpenOrders } from '../../../common/trade/actions'
import { getStellarOpenOrders } from '../../../common/trade/selectors'

import styles from './style.css'

import {
  Table
} from 'reactstrap'

class OpenOrders extends Component {

  constructor (props) {
    super()
    this.state = {

    }
  }

  async componentDidMount() {
    this.props.fetchOpenOrders()
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.tableContainer}>
          <Table hover>
            { this.renderTableHeaders() }
            <tbody>
              { this.props.stellarOpenOrders && this.renderTableBody() }
            </tbody>
          </Table>
        </div>
      </div>
    )
  }

  renderTableHeaders() {
    return (
      <thead>
        <tr style={{fontSize: '0.7rem'}}>
          <th>Selling</th>
          <th>Buying</th>
          <th>{`Price\n(in terms of selling asset)`}</th>
          <th>{`Price\n(in terms of buying asset)`}</th>
        </tr>
      </thead>
    )
  }

  renderTableBody() {
    if (this.props.stellarOpenOrders.length === 0) {
      return (
        <div>No open offers</div>
      )
    } else {
      return this.props.stellarOpenOrders.map((offer, index) => {
        const sellAssetType = offer.selling.asset_type === 'native' ? 'XLM' : offer.selling.asset_code
        const buyAssetType = offer.buying.asset_type === 'native' ? 'XLM' : offer.buying.asset_code
        return (
          <tr
            key = { index }
            style={{fontSize: '0.7rem'}}
            onClick={ ()=>{this.handleSellAssetSelection(asset, index)} }>
            <td>{ offer.amount } { sellAssetType }</td>
            <td>{ offer.price } { buyAssetType }</td>
            <td>{ offer.price_r.d / offer.price_r.n } { sellAssetType }</td>
            <td>{ offer.price_r.n / offer.price_r.d } { buyAssetType }</td>
          </tr>
        )
      })
    }
  }

}

const mapStateToProps = (state) => {
  return {
    stellarOpenOrders: getStellarOpenOrders(state)
  }
}

export default connect(
  mapStateToProps, {
    fetchOpenOrders
}) (OpenOrders)

