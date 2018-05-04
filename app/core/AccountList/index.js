import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'
import PropTypes from 'prop-types'

import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import numeral from 'numeral'

import Paper from 'material-ui/Paper'
import { withStyles, MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
}
from 'reactstrap'

import Slide from 'material-ui/transitions/Slide'

import {
  ListItemIcon,
  ListItemText,
  ListSubheader
} from 'material-ui/List'

import {
  MenuList,
  MenuItem
} from 'material-ui/Menu'

import Divider from 'material-ui/Divider'

import { getSupportedAssets } from '../../services/networking/lists'

import {
  fetchAccountDetails,
  setCurrentAccount,
  fetchSupportedAssets,
  fetchStellarAssetsForDisplay,
  fetchBlockEQTokensForDisplay,
  changeTrustOperation
} from '../../common/account/actions'

import {
  getAccounts,
  getCurrentAccount,
  getSupportedStellarAssets,
  getStellarAssetsForDisplay,
  getBlockEQTokensForDisplay
} from '../../common/account/selectors'

import {
  streamPayments
} from '../../common/payment/actions'

import {
  getIncomingPayment
} from '../../common/payment/selectors'

const font = "'Lato', sans-serif"

const materialStyles = {
  menuItem: {
    background: 'red !important',
    height: '2.25rem'
  },
}

const listSections = {
   wallet: { displayName: 'WALLET' },
   supported_assets: { displayName: 'SUPPORTED ASSETS' }
}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AccountList extends Component {

  constructor (props) {
    super()
    this.state = ({
      assetSelected: 0,
      changeTrustInProcess: false,
      changeTrustAsset: undefined
    })
    this.handleBlockEQTokenAddition = this.handleBlockEQTokenAddition.bind(this)
  }

  componentDidMount () {
    this.loadAccounts()
  }

  async loadAccounts () {
    try {
      const { accounts } = this.props
      if (!isEmpty(accounts)) {
        await this.props.fetchAccountDetails()
        if (this.props.userAccountDetailFailed) {
          await this.props.fetchSupportedAssets()
          await this.props.fetchStellarAssetsForDisplay()
          await this.props.fetchBlockEQTokensForDisplay()
        }
      }
    } catch (e) {
      console.log(e)
      // TODO: display something on the UI
    }
  }

  /*

  */

  render() {
    return (
      <div>
        <div style={{ width: '11.5rem', backgroundColor: '#FFFFFF', borderRight: '1px solid rgba(0, 0, 0, 0.125)', boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.15)', height: '100vh'}}>
          <MenuList style={{ height: '100vh' }}>
            <div style={{ marginTop: '1rem'}}>
              { this.renderSubHeader(listSections.wallet.displayName)}
            </div>
            <ListGroup id={styles.listItem}>
              { this.renderAssets() }
            </ListGroup>
            { (!isEmpty(this.props.blockEQTokens)) && this.renderSubHeader(listSections.supported_assets.displayName)}
            { this.renderSupportedAssets() }
          </MenuList>
        </div>
        { this.renderLoadingDialog() }
      </div>
    )
  }

  renderAssets() {
    if (this.props.assets) {
      const listItemStyleNormal = {outline: 'none', borderRadius: '0', borderColor: 'rgba(0, 0, 0, 0.125)', borderRight: '0', borderLeft: '0' }
      const listItemStyleActive = { ...listItemStyleNormal, backgroundColor: '#FAFAFA', color: '#002EC4' }

      return this.props.assets.map((asset, index) => {
        const selected = this.state.assetSelected === index ? true : false
        return (
          <ListGroupItem
            key = { index }
            style={ selected ? listItemStyleActive : listItemStyleNormal }
            active={ selected }
            tag='button'
            onClick={ this.handleStellarAssetSelection(asset, index) } action>
            {this.renderAccountListLabel(asset, selected)}
          </ListGroupItem>
        )
      })
    }
  }

  renderSupportedAssets() {
    if (this.props.blockEQTokens) {
      return this.props.blockEQTokens.map((asset, index) => {
        return (
          <MenuItem
            className={ materialStyles.menuItem }
            key={ index }
            disableRipple={ true }
            onClick={this.handleBlockEQTokenAddition(asset, index)}>
            {this.renderSupportedAssetListLabel(asset.asset_name)}
          </MenuItem>
        )
      })
    }
  }

  renderSubHeader (value) {
    return (
      <ListSubheader style={{fontFamily: font, outline: 'none', fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.04rem' }} component="div">
        {value}
      </ListSubheader>
    )
  }

  renderAccountListLabel (asset, isActive) {
    const labelView = (
      <label style={{fontSize: '0.85rem', marginBottom: '0rem'}}>
        <b>{ asset.asset_name }</b>
      </label>
    )

    const balanceView = (
      <label style={{fontSize: '0.65rem', marginBottom: '0rem'}}>
        {numeral(asset.balance).format('0,0.00')}
      </label>
    )

    return (
      <div className={styles.assetContainer}>
        { isActive && (<div className={styles.assetContainerActiveIndicator}/>)}
        <div className={styles.assetLabelContainer}>
          { labelView }
          { balanceView }
        </div>
      </div>
    )
  }

  renderSupportedAssetListLabel (value) {
    return (
      <label style={{fontFamily: font, fontSize: '0.85rem', paddingTop: '0.4rem'}}>
        {value}
      </label>
    )
  }

  renderLoadingDialog () {
    return (
      <Modal isOpen={this.state.changeTrustInProcess} className={this.props.className} centered={true}>
        <ModalHeader style={{boxShadow: 'none'}}>Please wait...</ModalHeader>
        <ModalBody>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <CircularProgress style={{ color: '#000000', marginRight: '0.75rem', paddingTop: '0.1rem' }} thickness={ 5 } size={ 15 } />
            Adding BlockEQ Token
          </div>
        </ModalBody>
      </Modal>
    )
  }

  handleStellarAssetSelection = (asset, index) => event => {
    event.preventDefault()
    this.setState({
      assetSelected: index
    })
    this.props.setCurrentAccount(asset)
  }

  handleBlockEQTokenAddition = (asset, index) => event => {
    event.preventDefault()
    console.log('Clicked!')
    this.setState({
      changeTrustInProcess: true,
      changeTrustIndex: asset
    })
    this.changeTrust (asset)
  }

  async changeTrust (asset) {
    await this.props.changeTrustOperation(asset)
    await this.refreshAccounts()
    this.setState({ changeTrustInProcess: false })
  }

  async refreshAccounts () {
    await this.props.fetchAccountDetails()
    await this.props.fetchStellarAssetsForDisplay()
    await this.props.fetchBlockEQTokensForDisplay()
  }

}

const mapStateToProps = (state) => {
  return {
    accounts: getAccounts(state),
    currentAccount: getCurrentAccount(state),
    supportedStellarAccounts: getSupportedStellarAssets(state),
    userAccountDetailFailed: state.account.fetchingFailed,
    incomingPayment: getIncomingPayment(state),
    assets: getStellarAssetsForDisplay(state),
    blockEQTokens: getBlockEQTokensForDisplay(state)
  }
}

export default connect(mapStateToProps, {
  fetchAccountDetails,
  setCurrentAccount,
  fetchSupportedAssets,
  streamPayments,
  fetchStellarAssetsForDisplay,
  fetchBlockEQTokensForDisplay,
  changeTrustOperation
})(AccountList)