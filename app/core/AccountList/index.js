import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'
import PropTypes from 'prop-types'

import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'

import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'

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
  fetchSupportedAssets
} from '../../common/account/actions'

import {
  getAccounts,
  getCurrentAccount,
  getSupportedStellarAssets
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

const stellarAssetDesc = {
  asset_order: 0,
  asset_type: 'native',
  asset_name: 'Stellar',
  asset_code: 'XLM'
}

class AccountList extends Component {

  constructor (props) {
    super()
    this.state = ({
      assetSelected: 0,
      assets: [],
      supportedAssets: []
    })
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
        await this.displayStellarAssets()
        await this.displaySupportedAccounts()
        await this.registerForNotifications()
      }
    } catch (e) {
      console.log(e)
      // TODO: display something on the UI
    }
  }

  displayStellarAssets () {
    const { accounts, supportedStellarAccounts } = this.props
    const { response } = supportedStellarAccounts
    var stellarAccounts = []

    Object.keys(accounts).map((key, index) => {
      if (accounts[key].type === stellarAssetDesc.asset_name) {
        const stellarAccount = accounts[Object.keys(accounts)[index]]
        stellarAccount.balances.map((acc, index) => {
          const displayAccount = {
            asset_type: acc.asset_type,
            balance: acc.balance,
            asset_code: acc.asset_type === stellarAssetDesc.asset_type ? stellarAssetDesc.asset_code : acc.asset_code,
            asset_name: acc.asset_type === stellarAssetDesc.asset_type ? stellarAssetDesc.asset_name : response[acc.asset_code.toLowerCase()].asset_name,
            pKey: stellarAccount.pKey,
            sKey: stellarAccount.sKey,
            sequence: stellarAccount.sequence
          }

          if (acc.asset_type === stellarAssetDesc.asset_type) {
            stellarAccounts.splice(stellarAssetDesc.asset_order, 0, displayAccount)
          } else {
            stellarAccounts.push(displayAccount)
          }
        })
      }
    })

    this.setState({ assets: stellarAccounts })
  }

  displaySupportedAccounts () {
    const { list } = this.props.supportedStellarAccounts
    var supportedDisplayAssets = []
    const stellarAccounts = this.state.assets

    for (var i = 0; i < list.length; i ++ ) {
      const supportedAsset = list[i]
      for (var j = 0; j < stellarAccounts.length; j ++ ) {
        const stellarAsset = stellarAccounts[j]
        if (stellarAsset.asset_type !== 'native')
          if (supportedAsset.asset_code !== stellarAsset.asset_code)
            supportedDisplayAssets.push(supportedAsset)
      }
    }

    this.setState({ supportedAssets: stellarAccounts.length > 1 ? supportedDisplayAssets : list })
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
            { this.renderSubHeader(listSections.supported_assets.displayName)}
            { this.renderSupportedAssets() }
          </MenuList>
        </Paper>
      </div>
    )
  }

  renderAssets() {
    return this.state.assets.map((asset, index) => {
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

  renderSupportedAssets() {
    return this.state.supportedAssets.map((asset, index) => {
      return (
        <MenuItem className={materialStyles.menuItem} key={index}>
          {this.renderSupportedAssetListLabel(asset.asset_name)}
        </MenuItem>
      )
    })
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

  handleStellarAssetSelection = (asset, index) => event => {
    event.preventDefault()
    this.setState({
      assetSelected: index
    })
    this.props.setCurrentAccount(asset)
  }

}

const mapStateToProps = (state) => {
  return {
    accounts: getAccounts(state),
    currentAccount: getCurrentAccount(state),
    supportedStellarAccounts: getSupportedStellarAssets(state),
    userAccountDetailFailed: state.account.fetchingFailed
  }
}

export default connect(mapStateToProps, {
  fetchAccountDetails,
  setCurrentAccount,
  fetchSupportedAssets,
  streamPayments
})(AccountList)