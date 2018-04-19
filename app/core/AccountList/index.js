import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'
import PropTypes from 'prop-types'

import isEmpty from 'lodash/isEmpty'

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

class AccountList extends Component {

  constructor (props) {
    super()
    this.state = ({
      itemSelected: 0,
      assets: [],
      supportedAssets: []
    })
    this.displaySupportedAccounts = this.displaySupportedAccounts.bind(this)
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
        await this.displaySupportedAccounts()
        await this.registerForNotifications()
      }
    } catch (e) {
      console.log(e)
      // TODO: display something on the UI
    }
  }

  async registerForNotifications () {
    if (!this.state.userAccountDetailFailed) {
      await this.props.streamPayments()
      if (this.props.incomingPayment.from !== this.props.currentAccount.pKey || this.props.incomingPayment.from !== undefined ) {
        new Notification('Payment Received',
          { body: `You have received ${this.props.incomingPayment.amount} XLM from ${this.props.incomingPayment.from}`}
        )
      }
    }
  }

  displaySupportedAccounts () {
    const { accounts } = this.props
    var supportedDisplayAssets = []
    var stellarAccounts = []

    Object.keys(accounts).map((key, index) => {
      if (accounts[key].type === 'Stellar') {
        //Stellar type accounts will have multiple balances
        const stellarAccount = accounts[Object.keys(accounts)[index]]
        if (stellarAccount.balances.length > 1) {
          //If there is more than one type of balance, then check if trust line has been added
          stellarAccount.balances.map(n => {
            //If the asset type is native, then put it first in the list
            if (n.asset_type === 'native') {
              const stellarAccountObj = {
                asset_code: 'XLM',
                asset_name: 'Stellar',
                asset_balance: n.balance
              }
              //Insert at index 0 without deleting any obj
              stellarAccounts.splice(0, 0, stellarAccountObj)
            } else {
              this.props.supportedStellarAccounts.map((value, index) => {
                if (value.asset_code !== n.asset_code) {
                  supportedDisplayAssets.push(value)
                } else {
                  const stellarSuppAccObj = {
                    asset_code: value.asset_code,
                    asset_name: value.asset_name,
                    asset_balance: n.balance
                  }
                  stellarAccounts.push(stellarSuppAccObj)
                }
              })
            }
          })
        } else {
          //Only Native Asset
          const stellarAccount = accounts[Object.keys(accounts)[0]]
          const stellarAccountObj = {
            asset_code: 'XLM',
            asset_name: 'Stellar',
            asset_balance: stellarAccount.balances[0].balance
          }
          stellarAccounts.push(stellarAccountObj)

          //Add all supported assets in the list
          this.props.supportedStellarAccounts.map((value, index) => {
            const stellarSuppAccObj = {
              asset_code: value.asset_code,
              asset_name: value.asset_name
            }
            supportedDisplayAssets.push(stellarSuppAccObj)
          })
        }
      }
    })

    this.setState({
      supportedAssets: supportedDisplayAssets,
      assets: stellarAccounts
    })

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
      return (
        <MenuItem className={materialStyles.menuItem} key={index}>
          {this.renderAccountListLabel(asset.asset_name, asset.asset_balance)}
        </MenuItem>
      )
    })
  }

  renderSupportedAssets() {
    return this.state.supportedAssets.map((asset, index) => {
      const isSelected = index === 0 ? true : false
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
        <label style={{fontFamily: font, fontSize: '0.85rem', paddingTop: '0.3rem', marginBottom: '-0.4rem'}}>
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