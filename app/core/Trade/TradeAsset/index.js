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
      offerAssetFiatValue: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSellAssetSelection = this.handleSellAssetSelection.bind(this)
    this.handleAmountSelection = this.handleAmountSelection.bind(this)
    this.toggleOfferDropDown = this.toggleOfferDropDown.bind(this)
    this.toggleReceiveDropDown = this.toggleReceiveDropDown.bind(this)
  }

  componentDidMount() {
    this.initialBuyAssetList()
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.assetContainer}>
          <h5 className={styles.assetContainerTitle}>
            Choose which assets to trade
          </h5>
          <div className={styles.tradeWidgetContainer}>
            { this.renderSellAsset() }
            <ArrowRight style={{marginLeft: '1.25rem', marginRight: '1.25rem', fontSize: '1.2rem', color: 'rgba(0, 0, 0, 0.2)' }}/>
            { this.renderBuyAsset() }
          </div>
          { this.renderBalanceAmountOptions() }
          { this.renderSubmitButton() }
        </div>
      </div>
    )
  }

  renderSellAsset() {
    const { assets } = this.props
    const selectedOfferAsset = assets[this.state.sellAssetSelected]
    const image = (
      <div className={ styles.assetWidgetImageContainer }>
        <img alt='' src={ selectedOfferAsset.asset_image } className={ styles.assetWidgetImage }/>
      </div>
    )
    return (
      <div className={ styles.assetWidgetContainer }>
        <InputGroup style={{ width: '100%'}}>
          <InputGroupAddon addonType='prepend'>
            <InputGroupText style={{fontSize: '0.75rem'}}>I have</InputGroupText>
          </InputGroupAddon>
          <Input name='offerAssetAmount' value={this.state.offerAssetAmount} onChange={this.handleChange} style={{ boxShadow: 'none', fontSize: '0.8rem'}}/>
          <InputGroupButtonDropdown addonType='append' isOpen={this.state.dropdownOfferAssetOpen} toggle={this.toggleOfferDropDown}>
            <DropdownToggle caret color='danger' style={{ boxShadow: 'none', fontSize: '0.75rem'}}>
              { selectedOfferAsset.asset_code }
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Select Asset</DropdownItem>
              { this.renderSellAssetList() }
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
        <InputGroupAddon addonType='prepend'>
            <InputGroupText style={{fontSize: '0.75rem'}}>I want</InputGroupText>
        </InputGroupAddon>
        <Input name='receiveAssetAmount' value={this.state.receiveAssetAmount} onChange={this.handleChange} style={{ boxShadow: 'none', fontSize: '0.8rem'}}/>
          <InputGroupButtonDropdown addonType="append" isOpen={this.state.dropdownReceiveAssetOpen} toggle={this.toggleReceiveDropDown}>
            <DropdownToggle caret color='success' style={{ boxShadow: 'none', fontSize: '0.75rem'}}>
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
    return this.props.assets.map((asset, index) => {
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
      <DropdownItem style={{fontSize: '0.85rem'}}><i className='fa fa-plus-circle' style={{marginRight: '0.45rem', color: 'rgb(0, 0, 0, 0.25)'}}></i>Add Asset</DropdownItem>
    )
  }

  renderBalanceAmountOptions() {
    const { assets } = this.props
    const { stellarMarketInfo } = this.props
    const selectedOfferAsset = assets[this.state.sellAssetSelected]
    const buttonStyle = { boxShadow: 'none', fontSize: '0.65rem' }
    console.log(`CAD: ${stellarMarketInfo.quotes.CAD.price}`)
    return (
      <div className={ styles.amountOptionContainer }>
        {this.state.offerAssetAmount.length === 0 && <h6 className={ styles.amountOptionTitle }>
          { numeral(selectedOfferAsset.balance).format('0,0.00')} {selectedOfferAsset.asset_code}
          <i className="fa fa-circle" style={{color:'#A1A1A1', marginRight: '0.5rem', marginLeft: '0.5rem', marginTop: '-0.1rem', fontSize: '0.4rem'}}></i>
          CAD ${numeral(selectedOfferAsset.balance*this.props.stellarMarketInfo.quotes.CAD.price).format('0,0.00')}
        </h6>}

        {this.state.offerAssetAmount.length > 0 && <h6 className={ styles.amountOptionTitle }>
        CAD Value ${numeral(this.state.offerAssetAmount * stellarMarketInfo.quotes.CAD.price).format('0,0.00')}
        </h6>}

        <ButtonGroup size='sm'>
          <Button outline style={buttonStyle} onClick={ this.handleAmountSelection(0.10)}>10%</Button>
          <Button outline style={buttonStyle} onClick={ this.handleAmountSelection(0.25)}>25%</Button>
          <Button outline style={buttonStyle} onClick={ this.handleAmountSelection(0.50)}>50%</Button>
          <Button outline style={buttonStyle} onClick={ this.handleAmountSelection(0.75)}>75%</Button>
          <Button outline style={buttonStyle} onClick={ this.handleAmountSelection(1)}>100%</Button>
        </ButtonGroup>
      </div>
    )
  }

  renderSubmitButton() {
    const btnTitle = { default: 'Submit Trade', processing: 'Submitting Trade'}
    return (
      <div style={{marginRight: '2rem', marginLeft: '2rem', marginTop: '2rem'}}>
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

  initialBuyAssetList() {
    const selectedSellAsset = this.props.assets[0]
    var tempArray = []
    this.props.assets.map((asset, index) => {
      if (asset.asset_code !== selectedSellAsset.asset_code) {
        tempArray.push(asset)
      }
    })

    this.setState({ buyAssetList: tempArray })
  }

  updateBuyAssetList(index) {
    //Update Buy List
    const selectedSellAsset = this.props.assets[index]
    var tempArray = []
    this.props.assets.map((asset, index) => {
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

}

const mapStateToProps = (state) => {
  return {
    assets: getStellarAssetsForDisplay(state),
    stellarMarketInfo: getStellarMarketInfo(state)
  }
}

export default connect(mapStateToProps, null)(TradeAsset)