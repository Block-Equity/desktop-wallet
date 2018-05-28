import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'

import { getStellarAssetsForDisplay } from '../../../common/account/selectors'
import { getStellarMarketInfo } from '../../../common/market/selectors'
import { makeTradeOffer } from '../../../common/trade/actions'

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
} from 'reactstrap'

import ArrowRight from 'material-ui-icons/ArrowForward'
import Snackbar from 'material-ui/Snackbar'
import SnackbarButton from 'material-ui/Button'
import ActionButton from '../../Shared/ActionButton'

import AddAsset from '../../Shared/AddAsset'
import MarketInfo from '../Market Info'

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
    this.handleTradeSubmission = this.handleTradeSubmission.bind(this)
    this.tradePrice = this.tradePrice.bind(this)
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
              tradePrice={this.tradePrice}
              sellAsset={this.state.sellAssetList[this.state.sellAssetSelected]}
              buyAsset={this.state.buyAssetList[this.state.buyAssetSelected]}/> }
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
      sellAssetSelected: index,
      offerAssetAmount: '',
      receiveAssetAmount: ''
    })
    await this.updateBuyAssetList(index)
    await this.marketInfo.getOrderBook(this.state.sellAssetList[this.state.sellAssetSelected], this.state.buyAssetList[this.state.buyAssetSelected])
  }

  handleBuyAssetSelection = (asset, index) => async event => {
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
    const formattedValue = numeral(percentage * selectedOfferAsset.balance).format('0,0.00')
    this.setState({
      offerAssetAmount: formattedValue,
      receiveAssetAmount: value * this.state.price
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

  handleAddAssetSubmission (success) {
    if (success) {
      this.toggleAddAssetModal()
    }
  }

  handleTradeSubmission = async () => {
    const sellAsset = this.state.sellAssetList[this.state.sellAssetSelected]
    const buyAsset = this.state.buyAssetList[this.state.buyAssetSelected]
    const tradePrice = this.state.price === 0 ? (this.state.receiveAssetAmount/this.state.offerAssetAmount) : this.state.price
    this.setState({ tradeProcessing: true })
    await this.props.makeTradeOffer(sellAsset.asset_code, sellAsset.asset_issuer, buyAsset.asset_code, buyAsset.asset_issuer,
      this.state.offerAssetAmount, tradePrice )
    await this.marketInfo.getOrderBook(this.state.sellAssetList[this.state.sellAssetSelected], this.state.buyAssetList[this.state.buyAssetSelected])
    this.setState({
      tradeProcessing: false,
      offerAssetAmount: '',
      receiveAssetAmount: '',
      alertOpen: true,
      alertMessage: 'Trade submitted successfully'
    })
  }

  tradePrice = (price) => {
    this.setState({
      price
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
  }
}

export default connect(
  mapStateToProps, {
    makeTradeOffer
}) (TradeAsset)