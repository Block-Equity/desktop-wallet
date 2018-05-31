import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'

import { fetchTradeHistory } from '../../../common/trade/actions'
import { getStellarTradeHistory } from '../../../common/trade/selectors'

import styles from './style.css'

import {
  Table
} from 'reactstrap'

const DISPLAY_FORMAT = '0,0.0000'

class History extends Component {

  constructor (props) {
    super()
    this.state = {

    }

  }

  async componentDidMount() {
    this.props.fetchTradeHistory()
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.tableContainer}>
          <Table hover responsive>
            { this.renderTableHeaders() }
            <tbody>
              { this.props.history && this.renderTableBody() }
            </tbody>
          </Table>
          { this.props.history && this.renderEmptyState() }
        </div>
      </div>
    )
  }

  renderTableHeaders() {
    return (
      <thead>
        <tr style={{fontSize: '0.7rem'}}>
          <th>Selling</th>
          <th>Price</th>
          <th>Value</th>
          <th></th>
        </tr>
      </thead>
    )
  }

  renderTableBody() {
    if (this.props.history.length > 0) {
      const rowStyle = {verticalAlign: 'middle'}
      return this.props.history.map((trade, index) => {
        const sellAssetType = trade.base_asset_type === 'native' ? 'XLM' : offer.base_asset_code
        const buyAssetType = trade.counter_asset_type === 'native' ? 'XLM' : offer.counter_asset_code
        return (
          <tr
            key = { index }
            style={{fontSize: '0.7rem'}}>
              <td style={rowStyle}>{ numeral(trade.base_amount).format(DISPLAY_FORMAT, Math.floor) } { sellAssetType }</td>
              <td style={rowStyle}>{ numeral(trade.price.n/trade.price.d).format(DISPLAY_FORMAT, Math.floor) } { buyAssetType }</td>
              <td style={rowStyle}>{ numeral(trade.counter_amount).format(DISPLAY_FORMAT, Math.floor) } { buyAssetType }</td>
              <td style={{textAlign: 'right'}}>{ this.renderCancelView(offer, index)}</td>
          </tr>
        )
      })
    }
  }

  renderEmptyState() {
    if (this.props.history.length === 0) {
      return (
        <div className={ styles.emptyContainer }>No trades</div>
      )
    }
  }

}

const mapStateToProps = (state) => {
  return {
    history: getStellarTradeHistory(state)
  }
}

export default connect(
  mapStateToProps, {
    fetchTradeHistory
}) (History)