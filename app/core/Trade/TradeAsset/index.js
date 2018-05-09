import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  getStellarAssetsForDisplay
} from '../../../common/account/selectors'

import styles from './style.css'

import {
  InputGroup,
  InputGroupButtonDropdown,
  Input,
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
      offerAssetSelected: 0,
      receiveAssetSelected: 0
    }

    this.handleChange = this.handleChange.bind(this)
    this.toggleOfferDropDown = this.toggleOfferDropDown.bind(this)
    this.toggleReceiveDropDown = this.toggleReceiveDropDown.bind(this)
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.assetContainer}>
          <h5 className={styles.assetContainerTitle}>
            Choose which assets to trade
          </h5>
          <div className={styles.tradeWidgetContainer}>
            { this.renderOfferAsset() }
            <ArrowRight style={{marginLeft: '1.25rem', marginRight: '1.25rem', marginTop: '1.3rem', fontSize: '1.2rem', color: 'rgba(0, 0, 0, 0.2)' }}/>
            { this.renderReceiveAsset() }
          </div>
          { this.renderBalanceAmountOptions() }
          { this.renderSubmitButton() }
        </div>
      </div>
    )
  }

  renderOfferAsset() {
    const { assets } = this.props
    const selectedOfferAsset = assets[this.state.offerAssetSelected]
    const image = (
      <div className={ styles.assetWidgetImageContainer }>
        <img alt='' src={ selectedOfferAsset.asset_image } className={ styles.assetWidgetImage }/>
      </div>
    )
    return (
      <div className={ styles.assetWidgetContainer }>
        <h6 className={ styles.widgetTitle }>OFFER</h6>
        <InputGroup style={{ width: '100%'}}>
          <Input name='offerAssetAmount' value={this.state.offerAssetAmount} onChange={this.handleChange} style={{ boxShadow: 'none'}}/>
          <InputGroupButtonDropdown addonType='append' isOpen={this.state.dropdownOfferAssetOpen} toggle={this.toggleOfferDropDown}>
            <DropdownToggle caret outline color='danger' style={{ boxShadow: 'none', fontSize: '0.75rem'}}>
              { selectedOfferAsset.asset_code }
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Select Asset</DropdownItem>
              { this.assetList() }
            </DropdownMenu>
          </InputGroupButtonDropdown>
        </InputGroup>
      </div>
    )
  }

  renderReceiveAsset() {
    return (
      <div className={ styles.assetWidgetContainer }>
        <h6 className={ styles.widgetTitle }>RECEIVE</h6>
        <InputGroup style={{width: '100%'}}>
        <Input name='receiveAssetAmount' value={this.state.receiveAssetAmount} onChange={this.handleChange} style={{ boxShadow: 'none'}}/>
          <InputGroupButtonDropdown addonType="append" isOpen={this.state.dropdownReceiveAssetOpen} toggle={this.toggleReceiveDropDown}>
            <DropdownToggle caret outline color='success' style={{ boxShadow: 'none', fontSize: '0.75rem'}}>
              PTS
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Select Asset</DropdownItem>
              { this.assetList() }
            </DropdownMenu>
          </InputGroupButtonDropdown>
        </InputGroup>
      </div>
    )
  }

  assetList() {
    return this.props.assets.map((asset, index) => {
      return (
        <DropdownItem key = { index } style={{fontSize: '0.7rem'}}>
          { `${ asset.asset_name } (${ asset.asset_code})` }
        </DropdownItem>
      )
    })
  }

  renderBalanceAmountOptions() {
    const { assets } = this.props
    const selectedOfferAsset = assets[this.state.offerAssetSelected]
    const buttonStyle = { boxShadow: 'none', fontSize: '0.7rem' }
    return (
      <div className={ styles.amountOptionContainer }>
        <h6 className={ styles.amountOptionTitle }>
          Your total available {selectedOfferAsset.asset_code} balance is <b>{selectedOfferAsset.balance}</b>
        </h6>
        <ButtonGroup size='sm'>
          <Button outline style={buttonStyle}>10%</Button>
          <Button outline style={buttonStyle}>25%</Button>
          <Button outline style={buttonStyle}>50%</Button>
          <Button outline style={buttonStyle}>75%</Button>
          <Button outline style={buttonStyle}>100%</Button>
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
  }
}

export default connect(mapStateToProps, null)(TradeAsset)