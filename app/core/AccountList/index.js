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

const supportedAssetData = [
  { id: 0, stellar: { id: 0,  title: 'Stellar', ticker: 'XLM' }, title: 'Stellar', ticker: 'XLM' },
  { id: 1, pts: { id: 1, title: 'BlockPoints', ticker: 'PTS'}, title: 'BlockPoints', ticker: 'PTS' },
  { id: 2, cadtoken: { id: 2, title: 'CAD Token', ticker: 'CAD'}, title: 'CAD Token', ticker: 'CAD' }
]

const listSections = {
   wallet: { displayName: 'WALLET' },
   supported_assets: { displayName: 'SUPPORTED ASSETS' }
}

class AccountList extends Component {

  constructor (props) {
    super()
    this.state = ({
      itemSelected: supportedAssetData[0],
      assets: [{ asset_code: 'XLM', asset_name: 'Stellar'}],
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
        const { supportedDisplayAssets, stellarAccounts } = await this.displaySupportedAccounts(accounts)
        this.setState({
          supportedAssets: supportedDisplayAssets,
          assets: stellarAccounts
        })
        if (!this.state.userAccountDetailFailed) {
          await this.props.streamPayments()
          if (this.props.incomingPayment.from !== this.state.publicKey || this.props.incomingPayment.from !== undefined ) {
            new Notification('Payment Received',
              { body: `You have received ${this.props.incomingPayment.amount} XLM from ${this.props.incomingPayment.from}`}
            )
          }
        }
      }
    } catch (e) {
      console.log(e)
      // TODO: display something on the UI
    }
  }

  displaySupportedAccounts (accounts) {
    var supportedDisplayAssets = []
    var stellarAccounts = []

    Object.keys(accounts).map((key, index) => {
      if (accounts[key].type === 'Stellar') {
        const stellarAccount = accounts[Object.keys(accounts)[index]]
        stellarAccount.balances.map(n => {
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
                const stellarSuppAccObj ={
                  asset_code: value.asset_code,
                  asset_name: value.asset_name,
                  asset_balance: n.balance
                }
                stellarAccounts.push(stellarSuppAccObj)
              }
            })
          }
        })
      }
    })

    return { supportedDisplayAssets, stellarAccounts }
  }

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <Paper elevation={2} style={{marginTop: '-0.5rem', width: '11.5rem'}}>
          <MenuList style={{marginTop: '2.5rem', height: '100vh'}}>
            { this.renderSubHeader(listSections.wallet.displayName)}
            { this.renderAssets() }
            <Divider />
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
          {this.renderListLabel(asset.asset_name, asset.asset_balance)}
        </MenuItem>
      )
    })
  }

  renderSupportedAssets() {
    return this.state.supportedAssets.map((asset, index) => {
      const isSelected = index === 0 ? true : false
      return (
        <MenuItem className={materialStyles.menuItem} key={index}>
          {this.renderListLabel(asset.asset_name)}
        </MenuItem>
      )
    })
  }

  renderSubHeader (value) {
    return (
      <ListSubheader style={{fontFamily: font, outline: 'none', fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.05rem' }} component="div">{value}</ListSubheader>
    )
  }

  renderListLabel (label, balance) {
    return (
      <div className={styles.assetContainer}>
        <label style={{fontFamily: font, fontSize: '0.85rem', paddingTop: '0.6rem', marginBottom: '-0.4rem'}}>
          {label}
        </label>
        <label style={{fontFamily: font, fontSize: '0.65rem'}}>
          {balance}
        </label>
      </div>
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