import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'

import { getStellarAssetsForDisplay } from '../../../common/account/selectors'
import { getStellarMarketInfo } from '../../../common/market/selectors'
import { makeTradeOffer } from '../../../common/trade/actions'
import { getBestOffer, getTradeStatus, getTradeErrorMessage } from '../../../common/trade/selectors'

import styles from './style.css'

import {
  InputGroup,
  InputGroupButtonDropdown,
  Input,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  ButtonGroup
} from 'reactstrap'

import ArrowRight from 'material-ui-icons/ArrowForward'
import ActionButton from '../../Shared/ActionButton'
import AddAsset from '../../Shared/AddAsset'
import Alert from '../../Shared/Alert'
import MarketInfo from '../Market Info'

class TradeAsset extends Component {

  constructor (props) {
    super()
    this.state = {
      dropdownOfferAssetOpen: false,
      dropdownReceiveAssetOpen: false,
      marketOrder: true,
      sellAssetSelected: 0,
      sellAssetList: [],
      buyAssetSelected: 0,
      buyAssetList: [],
      offerAssetAmount: '',
      offerAssetFiatValue: '',
      receiveAssetAmount: '',
      showAddAssetModal: false,
      tradeProcessing: false,
      alertOpen: false,
      alertMessage: '',
      alertSuccess: true
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleAmountSelection = this.handleAmountSelection.bind(this)
    this.toggleOfferDropDown = this.toggleOfferDropDown.bind(this)
    this.toggleReceiveDropDown = this.toggleReceiveDropDown.bind(this)
    this.toggleAddAssetModal = this.toggleAddAssetModal.bind(this)
    this.handleAddAssetSubmission = this.handleAddAssetSubmission.bind(this)
    this.handleTradeSubmission = this.handleTradeSubmission.bind(this)
    this.handleSellAssetSelection = this.handleSellAssetSelection.bind(this)
    this.setLimitOrderState = this.setLimitOrderState.bind(this)
    this.setMarketOrderState = this.setMarketOrderState.bind(this)
  }

  async componentDidMount() {
    await this.initialSellAssetList()
    await this.initialBuyAssetList()
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        { this.state.sellAssetList.length > 0
          && this.state.buyAssetList.length > 0
          && <MarketInfo onRef={ref => (this.marketInfo = ref)}
              isMarketOrder={this.state.marketOrder}
              buyAssetAmount={this.state.receiveAssetAmount}
              sellAssetAmount={this.state.offerAssetAmount}
              sellAsset={this.state.sellAssetList[this.state.sellAssetSelected]}
              buyAsset={this.state.buyAssetList[this.state.buyAssetSelected]}/> }
        <div className={styles.tradeWidgetContainer}>
          { this.renderSellAsset() }
          <ArrowRight
            style={{
              marginLeft: '0.75rem',
              marginRight: '0.75rem',
              marginTop: '-3.5rem',
              fontSize: '0.75rem',
              color: 'rgba(0, 0, 0, 0.2)'
            }}/>
          { this.renderBuyAsset() }
        </div>
        { this.renderSubmitButton() }
        <AddAsset showModal={ this.state.showAddAssetModal }
                  addAssetSuccessful={ this.handleAddAssetSubmission }
                  toggle={ this.toggleAddAssetModal } />
        <Alert
          open={this.state.alertOpen}
          message={this.state.alertMessage}
          success={this.state.alertSuccess}
          close={() => { this.setState({ alertOpen: false })}}
        />
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
            <DropdownToggle caret outline color='danger' style={{ boxShadow: 'none', fontSize: '0.75rem'}}>
              { this.state.sellAssetList.length > 0 && selectedOfferAsset.asset_code }
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Select Asset</DropdownItem>
              { this.state.sellAssetList.length > 0 && this.renderSellAssetList() }
            </DropdownMenu>
          </InputGroupButtonDropdown>
        </InputGroup>
        { this.renderBalanceAmountOptions() }
      </div>
    )
  }

  renderBuyAsset() {
    const currentBuyAsset = this.state.buyAssetList[this.state.buyAssetSelected]
    return (
      <div id={ styles.assetWidgetContainer }>
        <InputGroup style={{width: '100%'}}>
        <Input placeholder='I am buying' disabled={this.state.marketOrder} name='receiveAssetAmount' value={this.state.receiveAssetAmount} onChange={this.handleChange} style={{ boxShadow: 'none', fontSize: '0.8rem'}}/>
          <InputGroupButtonDropdown addonType="append" isOpen={this.state.dropdownReceiveAssetOpen} toggle={this.toggleReceiveDropDown}>
            <DropdownToggle caret outline color='success' style={{ boxShadow: 'none', fontSize: '0.75rem'}}>
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
        { this.renderSegmentForMarketLimitOrders() }
      </div>
    )
  }

  renderSellAssetList() {
    return this.state.sellAssetList.map((asset, index) => {
      return (
        <DropdownItem
          key = { index }
          style={{fontSize: '0.7rem'}}
          onClick={ ()=>{this.handleSellAssetSelection(asset, index)} }>
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
          onClick={ ()=>{this.handleBuyAssetSelection(asset, index)} }>
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

    const balance = selectedOfferAsset.asset_code === 'XLM' ? (selectedOfferAsset.balance - selectedOfferAsset.minimumBalance.minimumBalanceAmount) : selectedOfferAsset.balance
    const fiatConversionRate = selectedOfferAsset.asset_code === 'PTS' ? (0.00005*this.props.stellarMarketInfo.quotes.CAD.price) : this.props.stellarMarketInfo.quotes.CAD.price
    const fiatValueDisplayBalance = numeral(balance*fiatConversionRate).format('0,0.00')
    const fiatValueUSDDisplayBalance = numeral(balance*this.props.stellarMarketInfo.quotes.USD.price).format('0,0.00')
    const offerAmount = this.state.offerAssetAmount.length === 0 ? '' : this.state.offerAssetAmount
    const fiatValueDisplayEnteredAmt = numeral(offerAmount * fiatConversionRate).format('0,0.00')

    return (
      <div className={ styles.amountOptionContainer }>
        { /* //Figure out Fiat conversions first - TODO
          this.state.offerAssetAmount.length === 0 && selectedOfferAsset.asset_code === 'XLM' ? <h6 className={ styles.amountOptionTitle }>
            { numeral(balance).format('0,0.00')} {selectedOfferAsset.asset_code}
            <i className="fa fa-circle" style={{color:'#A1A1A1', marginRight: '0.5rem', marginLeft: '0.5rem', marginTop: '-0.1rem', fontSize: '0.4rem'}}></i>
            Approx. CAD ${fiatValueDisplayBalance}
            <i className="fa fa-circle" style={{color:'#A1A1A1', marginRight: '0.5rem', marginLeft: '0.5rem', marginTop: '-0.1rem', fontSize: '0.4rem'}}></i>
            USD ${fiatValueUSDDisplayBalance}
            </h6> :
            <h6 className={ styles.amountOptionTitle }>{ numeral(balance).format('0,0.00')} {selectedOfferAsset.asset_code} </h6>
        */
        }

        <h6 className={ styles.amountOptionTitle }>Available Balance: <b>{ numeral(balance).format('0,0.00')} {selectedOfferAsset.asset_code}</b> </h6>

        {
          /*this.state.offerAssetAmount.length > 0 && <h6 className={ styles.amountOptionTitle }>
            Approx. CAD ${fiatValueDisplayEnteredAmt}
          </h6>
          */
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
        <Button className={styles.preselectedAmountButton} key={index} outline style={buttonStyle} onClick={ this.handleAmountSelection(percent)}>{`${percent*100}%`}</Button>
      )
    })
  }

  renderSegmentForMarketLimitOrders() {
    const buttonStyle = { boxShadow: 'none', fontSize: '0.65rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }
    return (
      <div className={ styles.marketLimitOptionContainer }>
        <ButtonGroup size='sm'>
          <Button outline style={buttonStyle} onClick={ this.setMarketOrderState } active={this.state.marketOrder}>Market</Button>
          <Button outline style={buttonStyle} onClick={ this.setLimitOrderState } active={!this.state.marketOrder}>Limit</Button>
        </ButtonGroup>
      </div>
    )
  }

  renderSubmitButton() {
    const btnTitle = { default: 'Submit Trade', processing: 'Submitting Trade'}
    return (
      <div className={ styles.submitButtonContainer }>
        <ActionButton processing={ this.state.tradeProcessing } title={ btnTitle } isForm={ false } actionClicked={ this.handleTradeSubmission }/>
      </div>
    )
  }

  async handleSellAssetSelection(asset, index) {
    event.preventDefault()
    this.setState({
      sellAssetSelected: index,
      offerAssetAmount: '',
      receiveAssetAmount: ''
    })
    await this.updateBuyAssetList(index)
    await this.marketInfo.getOrderBook(this.state.sellAssetList[this.state.sellAssetSelected], this.state.buyAssetList[this.state.buyAssetSelected])
  }

  async handleBuyAssetSelection(asset, index) {
    event.preventDefault()
    await this.setState({
      buyAssetSelected: index,
      offerAssetAmount: '',
      receiveAssetAmount: ''
    })
    await this.marketInfo.getOrderBook(this.state.sellAssetList[this.state.sellAssetSelected], this.state.buyAssetList[this.state.buyAssetSelected])
  }

  handleAmountSelection = (percentage) => event => {
    const { assets } = this.props
    const selectedOfferAsset = assets[this.state.sellAssetSelected]
    const value = percentage * selectedOfferAsset.balance
    const formattedValue = numeral(percentage * selectedOfferAsset.balance).format('0,0.0000000')
    this.setState({
      offerAssetAmount: formattedValue,
      receiveAssetAmount: this.calculateReceiveAmount(this.props.bestOffer.marketPrice, value)
    })
  }

  setLimitOrderState() {
    this.setState({
      marketOrder: false
    })
  }

  setMarketOrderState() {
    this.setState({
      marketOrder: true,
      receiveAssetAmount: this.state.offerAssetAmount.length === 0 ? '' : this.calculateReceiveAmount(this.props.bestOffer.marketPrice, this.state.offerAssetAmount)
    })
  }

  initialSellAssetList() {
    console.log(`Updated Assets: ${JSON.stringify(this.props.assets)}`)
    var tempArray = []
    this.props.assets.map((asset) => {
      tempArray.push(asset)
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
    if (this.state.marketOrder) {
      if (name === 'offerAssetAmount') {
        this.setState({
          receiveAssetAmount: value.length === 0 ? '' : this.calculateReceiveAmount(this.props.bestOffer.marketPrice, value)
        })
      }
    }
  }

  toggleAddAssetModal (event) {
    this.setState({
      showAddAssetModal: !this.state.showAddAssetModal
    })
  }

  async handleAddAssetSubmission () {
    this.setState({
      showAddAssetModal: false
    })
    await this.initialSellAssetList()
    await this.initialBuyAssetList()
  }

  handleTradeSubmission = async () => {
    const sellAsset = this.state.sellAssetList[this.state.sellAssetSelected]
    const buyAsset = this.state.buyAssetList[this.state.buyAssetSelected]
    const tradePrice = this.state.marketOrder ?
      this.props.bestOffer.marketPrice :
      numeral(this.state.receiveAssetAmount/this.state.offerAssetAmount).format('0.0000000', Math.floor)

    //Validate if the market price is not 0
    if (this.state.marketOrder && this.props.bestOffer.marketPrice === 0 ) {
      this.setState({
        alertOpen: true,
        alertMessage: 'Trade price cannot be 0. Please override with limit order.',
        alertSuccess: false
      })
      return
    }

    //Initiate processing state to true
    this.setState({ tradeProcessing: true })

    //Make the offer
    await this.props.makeTradeOffer (
      sellAsset.asset_code,
      sellAsset.asset_issuer,
      buyAsset.asset_code,
      buyAsset.asset_issuer,
      this.state.offerAssetAmount,
      tradePrice
    )

    //Check error results
    if (!this.props.tradeErrorStatus) {
      await this.marketInfo.getOrderBook (
        this.state.sellAssetList[this.state.sellAssetSelected],
        this.state.buyAssetList[this.state.buyAssetSelected]
      )
    }

    //Set state based on results
    this.setState({
      tradeProcessing: false,
      offerAssetAmount: '',
      receiveAssetAmount: '',
      alertOpen: true,
      alertMessage: this.props.tradeErrorStatus ?
        'Trade transaction failed' :
        'Trade submitted successfully',
      alertSuccess: !this.props.tradeErrorStatus
    })

  }

  calculateReceiveAmount(price, amount) {
    return numeral(amount * price).format('0.0000000')
  }

}

const mapStateToProps = (state) => {
  return {
    assets: getStellarAssetsForDisplay(state),
    stellarMarketInfo: getStellarMarketInfo(state),
    bestOffer: getBestOffer(state),
    tradeErrorStatus: getTradeStatus(state),
    tradeErrorMessage: getTradeErrorMessage(state)
  }
}

export default connect(
  mapStateToProps, {
    makeTradeOffer
}) (TradeAsset)