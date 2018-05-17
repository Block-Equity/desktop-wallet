import React, { Component } from 'react'
import { connect } from 'react-redux'
import numeral from 'numeral'

import { getStellarAssetsForDisplay } from '../../../common/account/selectors'
import { getStellarMarketInfo } from '../../../common/market/selectors'

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
  ButtonGroup
} from 'reactstrap';

import ArrowRight from 'material-ui-icons/ArrowForward'
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
      showAddAssetModal: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSellAssetSelection = this.handleSellAssetSelection.bind(this)
    this.handleAmountSelection = this.handleAmountSelection.bind(this)
    this.toggleOfferDropDown = this.toggleOfferDropDown.bind(this)
    this.toggleReceiveDropDown = this.toggleReceiveDropDown.bind(this)
    this.toggleAddAssetModal = this.toggleAddAssetModal.bind(this)
  }

  async componentDidMount() {
    await this.initialSellAssetList()
    this.initialBuyAssetList()
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        { this.renderRateInfo() }
        { this.renderBalanceInfo() }
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
      </div>
    )
  }

  renderRateInfo () {
    return (
      <div className={ styles.tradeRateContainer }>
        Exchange Rate
        <b>1 XLM  =  10,000 PTS</b>
      </div>
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
    /*const image = (
      <div className={ styles.assetWidgetImageContainer }>
        <img alt='' src={ selectedOfferAsset.asset_image } className={ styles.assetWidgetImage }/>
      </div>
    )*/
    return (
      <div className={ styles.assetWidgetContainer }>
        <InputGroup style={{ width: '100%'}}>
          <Input name='offerAssetAmount' value={this.state.offerAssetAmount} onChange={this.handleChange} style={{ boxShadow: 'none', fontSize: '0.8rem'}}/>
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
      <div className={ styles.assetWidgetContainer }>
        <InputGroup style={{width: '100%'}}>
        <Input name='receiveAssetAmount' value={this.state.receiveAssetAmount} onChange={this.handleChange} style={{ boxShadow: 'none', fontSize: '0.8rem'}}/>
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
    const fiatValueDisplayEnteredAmt = numeral(this.state.offerAssetAmount.replace(',','') * fiatConversionRate).format('0,0.00')

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
        <ActionButton processing={ false } title={ btnTitle } actionClicked={ this.handleWriteMnemonicSubmit }/>
      </div>
    )
  }

  handleSellAssetSelection = (asset, index) => event => {
    event.preventDefault()
    this.setState({
      sellAssetSelected: index
    })
    this.updateBuyAssetList(index)
  }

  handleBuyAssetSelection = (asset, index) => event => {
    event.preventDefault()
    this.setState({
      buyAssetSelected: index
    })
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
  }

  toggleAddAssetModal (event) {
    this.setState({
      showAddAssetModal: !this.state.showAddAssetModal
    })
  }

  handleAddAssetSubmission (success) {
    if (success) {
      this.toggleAddAssetModal()
      //this.props.receiveSendPaymentInfo(this.state.info)
    }
  }

}

const mapStateToProps = (state) => {
  return {
    assets: getStellarAssetsForDisplay(state),
    stellarMarketInfo: getStellarMarketInfo(state)
  }
}

export default connect(mapStateToProps, null)(TradeAsset)