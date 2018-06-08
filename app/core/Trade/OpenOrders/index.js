import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'

import { fetchOpenOrders, deleteTradeOffer } from '../../../common/trade/actions'
import { getStellarOpenOrders } from '../../../common/trade/selectors'

import styles from './style.css'

import { CircularProgress } from 'material-ui/Progress'

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
      isCancelling: false,
      cancelledOfferIndex: undefined
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
          { this.props.stellarOpenOrders && this.renderEmptyState() }
        </div>
      </div>
    )
  }

  renderTableHeaders() {
    return (
      <thead className={styles.tableHeader}>
        <tr>
          <th>Selling Amount</th>
          <th>Price</th>
          <th>Received</th>
          <th></th>
        </tr>
      </thead>
    )
  }

  renderTableBody() {
    if (this.props.stellarOpenOrders.length > 0) {
      const rowStyle = {verticalAlign: 'middle'}
      return this.props.stellarOpenOrders.map((offer, index) => {
        const sellAssetType = offer.selling.asset_type === 'native' ? 'XLM' : offer.selling.asset_code
        const buyAssetType = offer.buying.asset_type === 'native' ? 'XLM' : offer.buying.asset_code
        return (
          <tr
            key = { index }
            style={{fontSize: '0.7rem'}}>
              <td style={rowStyle}>{ numeral(offer.amount).format(DISPLAY_FORMAT, Math.floor) } { sellAssetType }</td>
              <td style={rowStyle}>{ numeral(offer.price).format(DISPLAY_FORMAT, Math.floor) } { buyAssetType }</td>
              <td style={rowStyle}>{ numeral(offer.amount * offer.price).format(DISPLAY_FORMAT, Math.floor) } { buyAssetType }</td>
              <td style={{textAlign: 'right'}}>{ this.renderCancelView(offer, index)}</td>
          </tr>
        )
      })
    }
  }

  renderEmptyState() {
    if (this.props.stellarOpenOrders.length === 0) {
      return (
        <div className={ styles.emptyContainer }>No open offers</div>
      )
    }
  }

  renderCancelView(offer, index) {
    const defaultButton = (
      <Button outline color='danger' size='sm' style={{fontSize: '0.7rem'}} onClick={ () => {this.handleDeleteOffer(offer, index)}}>Cancel</Button>
    )

    const inProgressButton = (
      <Button disabled outline color='danger' size='sm' style={{fontSize: '0.7rem'}}>
        <CircularProgress style={{ color:'red', marginRight: '0.3rem' }} thickness={ 5 } size={ 10 } />Cancelling
      </Button>
    )

    if (this.state.isCancelling) {
      if (this.state.cancelledOfferIndex === index) {
        return inProgressButton
      } else {
        return defaultButton
      }
    } else {
      return defaultButton
    }
  }

  async handleDeleteOffer(offer, index) {
    event.preventDefault()
    this.setState({ isCancelling: true, cancelledOfferIndex: index })
    const offerSellingAssetCode = offer.selling.asset_type === 'native' ? 'XLM' : offer.selling.asset_code
    const offerSellingAssetIssuer = offer.selling.asset_type === 'native' ? '' : offer.selling.asset_issuer
    const offerBuyingAssetCode = offer.buying.asset_type === 'native' ? 'XLM' : offer.buying.asset_code
    const offerBuyingAssetIssuer = offer.buying.asset_type === 'native' ? '' : offer.buying.asset_issuer
    await this.props.deleteTradeOffer(offerSellingAssetCode, offerSellingAssetIssuer, offerBuyingAssetCode, offerBuyingAssetIssuer, offer.price_r, offer.id)
    await this.props.fetchOpenOrders()
    this.setState({ isCancelling: false, cancelledOfferIndex: undefined })
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

