import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'
import PropTypes from 'prop-types'

import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import { ListItemIcon, ListItemText, ListSubheader } from 'material-ui/List'
import { MenuList, MenuItem } from 'material-ui/Menu'
import Divider from 'material-ui/Divider'

import { getSupportedAssets } from '../../services/networking/lists'
import {
  fetchAccountDetails,
  setCurrentAccount
} from '../../common/account/actions'

import {
  getAccounts,
  getCurrentAccount
} from '../../common/account/selectors'

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

  }

  componentDidMount () {
    this.loadAccounts()
  }

  async loadAccounts () {
    //Fetch Stellar Accounts

    //Supported Asset List
    const { list, response, error } = await getSupportedAssets()
    console.log(`Fetching supported Assets ${JSON.stringify(list)}`)
    this.setState({
      supportedAssets: list
    })
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
          {this.renderListLabel(asset.asset_name)}
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

  renderListLabel (value) {
    return (
      <label style={{fontFamily: font, fontSize: '0.85rem', paddingTop: '0.5rem'}}>{value}</label>
    )
  }

}

export default AccountList