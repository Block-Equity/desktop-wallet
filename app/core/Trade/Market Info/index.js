import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'

import { getStellarMarketInfo } from '../../../common/market/selectors'
import { fetchStellarOrderBook } from '../../../common/trade/actions'
import { getStellarOrderBook } from '../../../common/trade/selectors'

import styles from './style.css'

import {
  Collapse,
  Table
} from 'reactstrap'

class MarketInfo extends Component {

  constructor (props) {
    super()
    this.state = {
      validDisplayPrice: true,
      displayPrice: '',
      displayAmount: '',
      orderBookOpened: false,
    }

    this.toggleOrderBook = this.toggleOrderBook.bind(this)
  }

  async componentDidMount() {
    await this.getOrderBook()
  }

  async getOrderBook() {
    const { sellAsset, buyAsset } = this.props
    await this.props.fetchStellarOrderBook(sellAsset.asset_code, sellAsset.asset_issuer, buyAsset.asset_code, buyAsset.asset_issuer)
    const { bids } = await this.props.stellarOrderBook
    const price = bids.length === 0 ? 0 : bids[0].price
    const displayPrice = bids.length === 0 ? 'No offers available' : `1 ${sellAsset.asset_code}  =  ${numeral(bids[0].price).format('0,0.0000')} ${buyAsset.asset_code}`
    const displayAmount = bids.length === 0 ? 'No assets available' : `${numeral(bids[0].amount).format('0,0.00')} ${buyAsset.asset_code}`
    this.setState({
      validDisplayPrice: bids.length !== 0,
      displayPrice,
      price,
      displayAmount
    })
  }

  render () {
    const divider = ( <div className={ styles.balanceInfoComponentDivider }/> )
    const orderBookLabel = this.state.validDisplayPrice ? ( this.state.orderBookOpened ? 'Close order book' : 'View order book') : 'Order book not available'
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div className={ styles.marketInfoContainer }>
          <div className={ styles.marketInfoContentContainer }>
            <label className={ styles.tradeRateContainerTitle }>Exchange Rate</label>
            <label className={ styles.tradeRateContainerContent }>
              { this.state.displayPrice }
            </label>
          </div>
          { this.state.validDisplayPrice &&
              <div style={{ marginLeft: '3rem', height: '100%'}}>
                <div className={ styles.marketInfoContentContainer }>
                  <label className={ styles.tradeRateContainerTitle }>Available Amount</label>
                  <label className={ styles.tradeRateContainerContent }>
                    { this.state.displayAmount }
                  </label>
                </div>
              </div>
          }
        </div>
        <div id={ styles.orderBookContainer }>
          <a onClick={this.toggleOrderBook}>{orderBookLabel}</a>
          { this.props.stellarOrderBook
            && this.state.validDisplayPrice
            && this.renderOrderBook()
          }
        </div>
      </div>
    )
  }

  renderOrderBook () {
    const { sellAsset, buyAsset } = this.props
    const { bids, asks } = this.props.stellarOrderBook

    const orderBookSellHeaders = (
      <thead>
        <tr>
          <th>{this.props.sellAsset.asset_code} Amount</th>
          <th>{this.props.buyAsset.asset_code} Amount</th>
          <th>{this.props.buyAsset.asset_code} Price</th>
        </tr>
    </thead>
    )

    const sellOrderContent = this.top5SellOrders(asks).map((data, index) => {
      return (
        <tr key={index}>
          <td>{numeral(data.amount).format('0,0.00')}</td>
          <td>{numeral(data.amount/(1/data.price)).format('0,0.00')}</td>
          <td>{numeral(1/data.price).format('0,0.0000')}</td>
        </tr>
      )
    })

    const sellOrderBook = (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '47.5%'}}>
        <b style={{color: 'red'}}>Top 5 Sell Offers</b>
        <Table size="sm" bordered style={{width: '100%', marginRight: '0.5rem'}}>
          { orderBookSellHeaders }
          <tbody>
            { sellOrderContent }
          </tbody>
        </Table>
      </div>
    )

    const orderBookBuyHeaders = (
      <thead>
        <tr>
          <th>{this.props.sellAsset.asset_code} Price</th>
          <th>{this.props.buyAsset.asset_code} Amount</th>
          <th>{this.props.sellAsset.asset_code} Amount</th>
        </tr>
      </thead>
    )

    const buyOrderContent = this.top5BuyOrders(bids).map((data, index) => {
      return (
        <tr key={index}>
          <td>{numeral(1/data.price).format('0,0.0000')}</td>
          <td>{numeral(data.amount).format('0,0.00')}</td>
          <td>{numeral(data.amount*(1/data.price)).format('0,0.00')}</td>
        </tr>
      )
    })

    const buyOrderBook = (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '47.5%'}}>
        <b style={{color: 'green'}}>Top 5 Buy Offers</b>
        <Table size="sm" bordered style={{width: '100%'}}>
          { orderBookBuyHeaders }
          <tbody>
            { buyOrderContent }
          </tbody>
        </Table>
      </div>
    )

    return (
      <Collapse isOpen={this.state.orderBookOpened} style={{width: '95%'}}>
        <div className={ styles.orderBookTableContainer }>
          { sellOrderBook }
          { buyOrderBook }
        </div>
      </Collapse>
    )
  }

  renderBalanceInfo () {
    const divider = ( <div className={ styles.balanceInfoComponentDivider }/> )
    return (
      <div className={ styles.balanceInfoContainer }>
        <div className={ styles.balanceInfoComponentContainer }>
          Available Balance
          <b>18.61 XLM</b>
        </div>
        { divider }
        <div className={ styles.balanceInfoComponentContainer }>
          Minimum Balance
          <b>3 XLM</b>
        </div>
        { divider }
        <div className={ styles.balanceInfoComponentContainer }>
          Fee
          <b>0.00001 XLM</b>
        </div>
      </div>
    )
  }

  toggleOrderBook() {
    this.setState({ orderBookOpened: !this.state.orderBookOpened });
  }

  top5SellOrders(asks) {
    var tempArray = []
    var length = asks.length > 5 ? 5 : asks.length
    for (var i = 0; i < length; i++) {
      const data = asks[i]
      tempArray.push(data)
    }
    return tempArray
  }

  top5BuyOrders(bids) {
    var tempArray = []
    var length = bids.length > 5 ? 5 : bids.length
    for (var i = 0; i < length; i++) {
      const data = bids[i]
      tempArray.push(data)
    }
    return tempArray
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