import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'
import PropTypes from 'prop-types'

import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'

import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import {
  Modal,
  ModalHeader,
  ModalBody
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

const materialStyles = theme => ({
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
})

const listSections = {
   wallet: { displayName: 'WALLET' },
   supported_assets: { displayName: 'BlockEQ TOKENS' }
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
        await this.props.fetchSupportedAssets()
        await this.props.fetchStellarAssetsForDisplay()
        await this.props.fetchBlockEQTokensForDisplay()
        await this.registerForNotifications()
      }
    } catch (e) {
      console.log(e)
      // TODO: display something on the UI
    }
  }

  async registerForNotifications () {
    if (!this.props.userAccountDetailFailed) {
      await this.props.streamPayments()
      if (this.props.incomingPayment.from !== this.props.currentAccount.pKey || this.props.incomingPayment.from !== undefined ) {
        new Notification('Payment Received',
          { body: `You have received ${this.props.incomingPayment.amount} XLM from ${this.props.incomingPayment.from}`}
        )
      }
    }
  }

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <Paper elevation={2} style={{marginTop: '-0.5rem', width: '11.5rem'}}>
          <MenuList style={{marginTop: '2.5rem', height: '100vh'}}>
            { this.renderSubHeader(listSections.wallet.displayName)}
            { this.renderAssets() }
            <Divider style={{marginTop: '1rem'}}/>
            { (!isEmpty(this.props.blockEQTokens)) && this.renderSubHeader(listSections.supported_assets.displayName)}
            { this.renderSupportedAssets() }
          </MenuList>
        </Paper>
        { this.renderLoadingDialog() }
      </div>
    )
  }

  renderAssets() {
    if (this.props.assets) {
      return this.props.assets.map((asset, index) => {
        const selected = this.state.assetSelected === index ? true : false
        return (
          <MenuItem
            className={ materialStyles.menuItem }
            key={ index }
            selected={ selected }
            onClick={ this.handleStellarAssetSelection(asset, index) }>
            {this.renderAccountListLabel(asset.asset_name, asset.balance)}
          </MenuItem>
        )
      })
    }
  }

  renderSupportedAssets() {
    if (this.props.blockEQTokens) {
      return this.props.blockEQTokens.map((asset, index) => {
        return (
          <MenuItem
            className={materialStyles.menuItem}
            key={index}
            onClick={this.handleBlockEQTokenAddition(asset, index)}>
            {this.renderSupportedAssetListLabel(asset.asset_name)}
          </MenuItem>
        )
      })
    }
  }

  renderSubHeader (value) {
    return (
      <ListSubheader style={{fontFamily: font, outline: 'none', fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.05rem' }} component="div">{value}</ListSubheader>
    )
  }

  renderAccountListLabel (label, balance) {
    return (
      <div className={styles.assetContainer}>
        <label style={{fontFamily: font, fontSize: '0.85rem', paddingTop: '0.45rem', marginBottom: '-0.4rem'}}>
          {label}
        </label>
        <label style={{fontFamily: font, fontSize: '0.65rem'}}>
          {balance}
        </label>
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
    //this.refreshAccounts()
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