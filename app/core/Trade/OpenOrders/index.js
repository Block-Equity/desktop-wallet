import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'

import { fetchOpenOrders, deleteTradeOffer } from '../../../common/trade/actions'
import { getStellarOpenOrders } from '../../../common/trade/selectors'

import styles from './style.css'

import {
  Table,
  Button
} from 'reactstrap'

const DISPLAY_FORMAT = '0,0.0000'
const CALCULATION_FORMAT = '0.0000000'

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
          <Table hover responsive>
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
          <th>Selling Amount</th>
          <th>Price</th>
          <th>Value</th>
          <th></th>
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
      const rowStyle = {verticalAlign: 'middle'}
      return this.props.stellarOpenOrders.map((offer, index) => {
        const sellAssetType = offer.selling.asset_type === 'native' ? 'XLM' : offer.selling.asset_code
        const buyAssetType = offer.buying.asset_type === 'native' ? 'XLM' : offer.buying.asset_code
        return (
          <tr
            key = { index }
            style={{fontSize: '0.7rem'}}>
              <td style={rowStyle}>{ numeral(offer.amount).format(DISPLAY_FORMAT, Math.floor) } { sellAssetType }</td>
              <td style={rowStyle}>{ numeral(offer.price).format(DISPLAY_FORMAT, Math.floor) } { sellAssetType }</td>
              <td style={rowStyle}>{ numeral(offer.amount * offer.price).format(DISPLAY_FORMAT, Math.floor) } { buyAssetType }</td>
              <td><Button outline color='danger' size='sm' style={{fontSize: '0.7rem'}} onClick={ () => {this.handleDeleteOffer(offer)}}>Cancel</Button></td>
          </tr>
        )
      })
    }
  }

  async handleDeleteOffer(offer) {
    event.preventDefault()
    const offerSellingAssetCode = offer.selling.asset_type === 'native' ? 'XLM' : offer.selling.asset_code
    const offerSellingAssetIssuer = offer.selling.asset_type === 'native' ? '' : offer.selling.asset_issuer
    const offerBuyingAssetCode = offer.buying.asset_type === 'native' ? 'XLM' : offer.buying.asset_code
    const offerBuyingAssetIssuer = offer.buying.asset_type === 'native' ? '' : offer.buying.asset_issuer
    await this.props.deleteTradeOffer(offerSellingAssetCode, offerSellingAssetIssuer, offerBuyingAssetCode, offerBuyingAssetIssuer, offer.id)
    this.props.fetchOpenOrders()
  }

}

const mapStateToProps = (state) => {
  return {
    stellarOpenOrders: getStellarOpenOrders(state)
  }
}

export default connect(
  mapStateToProps, {
    fetchOpenOrders,
    deleteTradeOffer
}) (OpenOrders)

