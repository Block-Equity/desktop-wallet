import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'

import { getStellarAssetsForDisplay } from '../../../common/account/selectors'
import { getStellarMarketInfo } from '../../../common/market/selectors'
import { fetchStellarOrderBook, makeTradeOffer } from '../../../common/trade/actions'
import { getStellarOrderBook } from '../../../common/trade/selectors'

import styles from './style.css'

import {
  InputGroup,
  InputGroupButtonDropdown,
  Input,
  InputGroupText,
  InputGroupAddon,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  ButtonGroup,
  Collapse,
  Table
} from 'reactstrap';

import ArrowRight from 'material-ui-icons/ArrowForward'
import Snackbar from 'material-ui/Snackbar'
import SnackbarButton from 'material-ui/Button'
import ActionButton from '../../Shared/ActionButton'

import AddAsset from '../../Shared/AddAsset'

class TradeAsset extends Component {

  constructor (props) {
    super()
    this.state = {
      dropdownOfferAssetOpen: false,
      dropdownReceiveAssetOpen: false,
      sellAssetSelected: 0,
      sellAssetList: [],
      buyAssetSelected: 0,
      buyAssetList: [],
      offerAssetAmount: '',
      offerAssetFiatValue: '',
      showAddAssetModal: false,
      validDisplayPrice: true,
      displayPrice: '',
      displayAmount: '',
      orderBookOpened: false,
      tradeProcessing: false,
      alertOpen: false,
      alertMessage: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSellAssetSelection = this.handleSellAssetSelection.bind(this)
    this.handleAmountSelection = this.handleAmountSelection.bind(this)
    this.toggleOfferDropDown = this.toggleOfferDropDown.bind(this)
    this.toggleReceiveDropDown = this.toggleReceiveDropDown.bind(this)
    this.toggleAddAssetModal = this.toggleAddAssetModal.bind(this)
    this.toggleOrderBook = this.toggleOrderBook.bind(this)
    this.handleTradeSubmission = this.handleTradeSubmission.bind(this)
  }

  async componentDidMount() {
    await this.initialSellAssetList()
    await this.initialBuyAssetList()
    await this.getOrderBook()
  }

  async getOrderBook() {
    const sellAsset = this.state.sellAssetList[this.state.sellAssetSelected]
    const buyAsset = this.state.buyAssetList[this.state.buyAssetSelected]
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

  render() {
    return (
      <div className={styles.mainContainer}>
        { this.props.stellarOrderBook && this.state.sellAssetList.length > 0 && this.state.buyAssetList.length > 0 && this.renderRateInfo() }
        <div className={styles.tradeWidgetContainer}>
          { this.renderSellAsset() }
          <ArrowRight
            style={{
              marginLeft: '0.75rem',
              marginRight: '0.75rem',
              fontSize: '0.85rem',
              color: 'rgba(0, 0, 0, 0.2)'
            }}/>
          { this.renderBuyAsset() }
        </div>
        { this.renderBalanceAmountOptions() }
        { this.renderSubmitButton() }
        <AddAsset showModal={ this.state.showAddAssetModal }
                  addAssetSuccessful={ this.handleAddAssetSubmission }
                  toggle={ this.toggleAddAssetModal } />
        { this.renderAlertView() }
      </div>
    )
  }

  renderRateInfo () {
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
          { this.state.validDisplayPrice && this.renderOrderBook() }
        </div>
      </div>
    )
  }

  renderOrderBook () {
    const sellAsset = this.state.sellAssetList[this.state.sellAssetSelected]
    const buyAsset = this.state.buyAssetList[this.state.buyAssetSelected]
    const { bids, asks } = this.props.stellarOrderBook

    const orderBookSellHeaders = (
      <thead>
        <tr>
          <th>{sellAsset.asset_code} Amount</th>
          <th>{buyAsset.asset_code} Amount</th>
          <th>{buyAsset.asset_code} Price</th>
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
          <th>{sellAsset.asset_code} Price</th>
          <th>{buyAsset.asset_code} Amount</th>
          <th>{sellAsset.asset_code} Amount</th>
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

  renderSellAsset() {
    const { sellAssetList } = this.state
    const selectedOfferAsset = sellAssetList[this.state.sellAssetSelected]
    return (
      <div id={ styles.assetWidgetContainer }>
        <InputGroup style={{ width: '100%'}}>
          <Input placeholder='I am selling' name='offerAssetAmount' value={this.state.offerAssetAmount} onChange={this.handleChange} style={{ boxShadow: 'none', fontSize: '0.8rem'}}/>
          <InputGroupButtonDropdown addonType='append' isOpen={this.state.dropdownOfferAssetOpen} toggle={this.toggleOfferDropDown}>
            <DropdownToggle caret color='secondary' style={{ boxShadow: 'none', fontSize: '0.75rem'}}>
              { this.state.sellAssetList.length > 0 &&  selectedOfferAsset.asset_code }
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Select Asset</DropdownItem>
              { this.state.sellAssetList.length > 0 && this.renderSellAssetList() }
            </DropdownMenu>
          </InputGroupButtonDropdown>
        </InputGroup>
      </div>
    )
  }

  renderBuyAsset() {
    const currentBuyAsset = this.state.buyAssetList[this.state.buyAssetSelected]
    return (
      <div id={ styles.assetWidgetContainer }>
        <InputGroup style={{width: '100%'}}>
        <Input placeholder='I am buying' disabled={true} name='receiveAssetAmount' value={this.state.receiveAssetAmount} onChange={this.handleChange} style={{ boxShadow: 'none', fontSize: '0.8rem'}}/>
          <InputGroupButtonDropdown addonType="append" isOpen={this.state.dropdownReceiveAssetOpen} toggle={this.toggleReceiveDropDown}>
            <DropdownToggle caret color='secondary' style={{ boxShadow: 'none', fontSize: '0.75rem'}}>
              { this.state.buyAssetList.length > 0 && currentBuyAsset.asset_code }
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Select Asset</DropdownItem>
              { this.state.buyAssetList.length > 0 && this.renderBuyAssetList() }
              <DropdownItem divider />
              { this.renderAddAssetOption() }
            </DropdownMenu>
          </InputGroupButtonDropdown>
        </InputGroup>
      </div>
    )
  }

  renderSellAssetList() {
    return this.state.sellAssetList.map((asset, index) => {
      return (
        <DropdownItem
          key = { index }
          style={{fontSize: '0.7rem'}}
          onClick={ this.handleSellAssetSelection(asset, index) }>
          { `${ asset.asset_name } (${ asset.asset_code})` }
        </DropdownItem>
      )
    })
  }

  renderBuyAssetList() {
    return this.state.buyAssetList.map((asset, index) => {
      return (
        <DropdownItem
          key = { index }
          style={{fontSize: '0.7rem'}}
          onClick={ this.handleBuyAssetSelection(asset, index) }>
            { `${ asset.asset_name } (${ asset.asset_code})` }
        </DropdownItem>
      )
    })
  }

  renderAddAssetOption() {
    return (
      <DropdownItem
        style={{fontSize: '0.85rem'}}
        onClick={ this.toggleAddAssetModal }>
        <i className='fa fa-plus-circle' style={{marginRight: '0.45rem', color: 'rgb(0, 0, 0, 0.25)'}}></i>
          Add Asset
      </DropdownItem>
    )
  }

  renderBalanceAmountOptions() {
    const { assets } = this.props
    const { stellarMarketInfo } = this.props
    const selectedOfferAsset = assets[this.state.sellAssetSelected]

    const fiatConversionRate = selectedOfferAsset.asset_code === 'PTS' ? (0.00005*this.props.stellarMarketInfo.quotes.CAD.price) : this.props.stellarMarketInfo.quotes.CAD.price
    const fiatValueDisplayBalance = numeral(selectedOfferAsset.balance*fiatConversionRate).format('0,0.00')
    const offerAmount = this.state.offerAssetAmount.length === 0 ? '' : this.state.offerAssetAmount
    const fiatValueDisplayEnteredAmt = numeral(offerAmount * fiatConversionRate).format('0,0.00')

    return (
      <div className={ styles.amountOptionContainer }>
        {
          this.state.offerAssetAmount.length === 0 && <h6 className={ styles.amountOptionTitle }>
            { numeral(selectedOfferAsset.balance).format('0,0.00')} {selectedOfferAsset.asset_code}
            <i className="fa fa-circle" style={{color:'#A1A1A1', marginRight: '0.5rem', marginLeft: '0.5rem', marginTop: '-0.1rem', fontSize: '0.4rem'}}></i>
            Approx. CAD ${fiatValueDisplayBalance}
          </h6>
        }

        {
          this.state.offerAssetAmount.length > 0 && <h6 className={ styles.amountOptionTitle }>
            Approx. CAD ${fiatValueDisplayEnteredAmt}
          </h6>
        }

        <ButtonGroup size='sm'>
          { this.renderSegmentForPercentAmount() }
        </ButtonGroup>
      </div>
    )
  }

  renderSegmentForPercentAmount() {
    const preDeterminedPercentageAmounts = [0.10, 0.25, 0.50, 0.75, 1]
    const buttonStyle = { boxShadow: 'none', fontSize: '0.65rem' }
    return preDeterminedPercentageAmounts.map((percent, index) => {
      return (
        <Button key={index} outline style={buttonStyle} onClick={ this.handleAmountSelection(percent)}>{`${percent*100}%`}</Button>
      )
    })
  }

  renderSubmitButton() {
    const btnTitle = { default: 'Submit Trade', processing: 'Submitting Trade'}
    return (
      <div className={ styles.submitButtonContainer }>
        <ActionButton processing={ this.state.tradeProcessing } title={ btnTitle } isForm={ false } actionClicked={ this.handleTradeSubmission }/>
      </div>
    )
  }

  handleSellAssetSelection = (asset, index) => async event => {
    event.preventDefault()
    await this.setState({
      sellAssetSelected: index
    })
    await this.updateBuyAssetList(index)
    await this.getOrderBook()
  }

  handleBuyAssetSelection = (asset, index) => async event => {
    event.preventDefault()
    await this.setState({
      buyAssetSelected: index
    })
    await this.getOrderBook()
  }

  handleAmountSelection = (percentage) => event => {
    const { assets } = this.props
    const selectedOfferAsset = assets[this.state.sellAssetSelected]
    const value = numeral(percentage * selectedOfferAsset.balance).format('0,0.00')
    console.log(`Stellar Balance: ${selectedOfferAsset.balance} || Percentage: ${percentage}`)
    this.setState({
      offerAssetAmount:value
    })
  }

  initialSellAssetList() {
    const selectedSellAsset = this.props.assets[0]
    var tempArray = []
    this.props.assets.map((asset, index) => {
      if (asset.asset_code !== 'CAD') {
        tempArray.push(asset)
      }
    })

    this.setState({
      sellAssetList: tempArray
    })
  }

  initialBuyAssetList() {
    const selectedSellAsset = this.state.sellAssetList[0]
    var tempArray = []
    this.state.sellAssetList.map((asset, index) => {
      if (asset.asset_code !== selectedSellAsset.asset_code) {
        tempArray.push(asset)
      }
    })

    this.setState({ buyAssetList: tempArray })
  }

  updateBuyAssetList(index) {
    //Update Buy List
    const selectedSellAsset = this.state.sellAssetList[index]
    var tempArray = []
    this.state.sellAssetList.map((asset, index) => {
      if (asset.asset_code !== selectedSellAsset.asset_code) {
        tempArray.push(asset)
      }
    })

    //Update buy asset selection
    const selectedBuyAsset = this.state.buyAssetList[this.state.buyAssetSelected]
    const updatedBuyAssetIndex = selectedSellAsset.asset_code === selectedBuyAsset.asset_code ? 0 : this.state.buyAssetSelected

    //Set state with updated data
    this.setState({
      buyAssetList: tempArray,
      buyAssetSelected: updatedBuyAssetIndex
    })
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

  toggleOfferDropDown() {
    this.setState({
      dropdownOfferAssetOpen: !this.state.dropdownOfferAssetOpen
    })
  }

  toggleReceiveDropDown() {
    this.setState({
      dropdownReceiveAssetOpen: !this.state.dropdownReceiveAssetOpen
    })
  }

  handleChange (event) {
    const target = event.target
    var value = target.value
    const name = target.name
    value = value.replace(/[^0.001-9]/g, '')
    this.setState({
      [name]: value
    })
    if (name === 'offerAssetAmount') {
      this.setState({
        receiveAssetAmount: value.length === 0 ? '' : value*this.state.price
      })
    }
  }

  toggleAddAssetModal (event) {
    this.setState({
      showAddAssetModal: !this.state.showAddAssetModal
    })
  }

  toggleOrderBook() {
    this.setState({ orderBookOpened: !this.state.orderBookOpened });
  }

  handleAddAssetSubmission (success) {
    if (success) {
      this.toggleAddAssetModal()
      //this.props.receiveSendPaymentInfo(this.state.info)
    }
  }

  handleTradeSubmission = async () => {
    const sellAsset = this.state.sellAssetList[this.state.sellAssetSelected]
    const buyAsset = this.state.buyAssetList[this.state.buyAssetSelected]
    const tradePrice = this.state.price === 0 ? (this.state.receiveAssetAmount/this.state.offerAssetAmount) : this.state.price
    this.setState({ tradeProcessing: true })
    await this.props.makeTradeOffer(sellAsset.asset_code, sellAsset.asset_issuer, buyAsset.asset_code, buyAsset.asset_issuer,
      this.state.offerAssetAmount, tradePrice )
    this.setState({
      tradeProcessing: false,
      offerAssetAmount: '',
      receiveAssetAmount: '',
      alertOpen: true,
      alertMessage: 'Trade submitted successfully'
    })
  }

  renderAlertView() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.alertOpen}
          autoHideDuration={6000}
          onClose={this.handleAlertClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.alertMessage}</span>}
          action={[
            <SnackbarButton key="close" color="secondary" size="small"
              onClick={this.handleAlertClose}>
              CLOSE
            </SnackbarButton>
          ]}
        />
      </div>
    )
  }

  handleAlertOpen (message) {
    this.setState({
      alertOpen: true,
      alertMessage: message
    })
  }

  handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      alertOpen: false
    })
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
    fetchStellarOrderBook,
    makeTradeOffer
}) (TradeAsset)