import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'
import PropTypes from 'prop-types'

import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import numeral from 'numeral'

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
      }
    } catch (e) {
      console.log(e)
      // TODO: display something on the UI
    }
  }

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <Paper elevation={2} style={{marginTop: '-0.5rem', width: '11.5rem'}}>
          <MenuList style={{marginTop: '2.5rem', height: '100vh'}}>
            { this.renderSubHeader(listSections.wallet.displayName)}
            { this.renderAssets() }
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
          <div key={ index }>
            <MenuItem style={{height: '2.25rem'}}
              className={ materialStyles.menuItem }
              selected={ selected }
              onClick={ this.handleStellarAssetSelection(asset, index) }>
              {this.renderAccountListLabel(asset)}
            </MenuItem>
            <Divider />
          </div>
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
      <ListSubheader style={{fontFamily: font, outline: 'none', fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.04rem' }} component="div">
        {value}
      </ListSubheader>
    )
  }

  renderAccountListLabel (asset) {
    const labelView = (
      <label style={{fontFamily: font, fontSize: '0.85rem', marginTop: '0.8rem'}}>
        { asset.asset_name }
      </label>
    )

    const balanceView = (
      <label style={{fontFamily: font, fontSize: '0.65rem', marginTop: '-1rem'}}>
        {numeral(asset.balance).format('0,0.00')}
      </label>
    )

    return (
      <div className={styles.assetContainer}>
        { labelView }
        { balanceView }
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