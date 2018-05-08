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
  DropdownItem
} from 'reactstrap';

import ArrowRight from 'material-ui-icons/ArrowForward'

class Trade extends Component {

  constructor (props) {
    super()
    this.state = {
      dropdownOfferAssetOpen: false,
      dropdownReceiveAssetOpen: false,
    }
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
          <div className={styles.assetWidgetContainer}>
            { this.renderOfferAsset() }
            <ArrowRight style={{marginLeft: '1.25rem', marginTop: '0.5rem', fontSize: '1.2rem', color: 'rgba(0, 0, 0, 0.2)' }}/>
            { this.renderReceiveAsset() }
          </div>
        </div>
      </div>
    )
  }

  renderOfferAsset() {
    return (
      <InputGroup style={{width: '40%'}}>
        <Input />
        <InputGroupButtonDropdown addonType="append" isOpen={this.state.dropdownOfferAssetOpen} toggle={this.toggleOfferDropDown}>
          <DropdownToggle caret outline color="danger">
            XLM
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Select Asset</DropdownItem>
            <DropdownItem>BlockPoints (PTS)</DropdownItem>
            <DropdownItem>Canadian Dollar (CAD)</DropdownItem>
          </DropdownMenu>
        </InputGroupButtonDropdown>
      </InputGroup>
    )
  }

  renderReceiveAsset() {
    return (
      <InputGroup style={{width: '40%', marginLeft: '1.25rem'}}>
        <Input />
        <InputGroupButtonDropdown addonType="append" isOpen={this.state.dropdownReceiveAssetOpen} toggle={this.toggleReceiveDropDown}>
          <DropdownToggle caret outline color="success">
            PTS
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Select Asset</DropdownItem>
            <DropdownItem>Stellar Lumens (XLM)</DropdownItem>
            <DropdownItem>Canadian Dollar (CAD)</DropdownItem>
          </DropdownMenu>
        </InputGroupButtonDropdown>
      </InputGroup>
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

}

const mapStateToProps = (state) => {
  return {
    assets: getStellarAssetsForDisplay(state),
  }
}

export default connect(mapStateToProps, null)(Trade)