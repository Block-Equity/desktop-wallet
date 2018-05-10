import React, { Component } from 'react'
import { connect } from 'react-redux'

import isEmpty from 'lodash/isEmpty'
import { unlock } from '../../common/auth/actions'
import { initializeDB } from '../../common/account/actions'
import { getCurrentApp } from '../../common/app/selectors'
import { fetchStellarMarketInfo } from '../../common/market/actions'

//Style
import styles from './style.css'
import NavBar from '../Shared/NavBar'
import Settings from '../Settings'
import AppList from '../AppList'
import Wallet from '../Wallet'
import Trade from '../Trade'
import AccountList from '../Wallet/AccountList'

import statusBarLogo from '../Launch/logo-brand-color.png'
import IconButton from 'material-ui/IconButton'
import SettingIcon from 'material-ui-icons/Settings'

const appItems = {
  wallet: { displayLabel: 'Wallet', id: 0 } ,
  trade: { displayLabel: 'Trading', id: 1 },
  settings: { displayLabel: 'Settings', id: 2 }
}

class AppView extends Component {

  constructor (props) {
    super()
    this.state = ({
      dbInit: false,
      settingsOpen: false
    })
    this.toggleSettingsDrawer = this.toggleSettingsDrawer.bind(this)
  }

  async componentDidMount () {
    try {
      await this.props.unlock()
      await this.props.initializeDB()
      await this.props.fetchStellarMarketInfo()
      this.setState({
        dbInit: true
      })
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        { this.renderStatusBar() }
        <div className={styles.contentContainer}>
          <div style={{zIndex: '2'}}>
            <AppList />
          </div>
          { this.renderContent() }
        </div>
        <Settings setOpen={this.toggleSettingsDrawer(!this.state.settingsOpen)} open={this.state.settingsOpen}/>
      </div>
    )
  }

  renderStatusBar() {
    return (
      <div className={styles.statusBarContainer} style={{zIndex: '3'}}>
        <img src={ statusBarLogo } alt='' width='34' height='17'/>
      </div>
    )
  }

  renderStatusBarWithSettings() {
    return (
      <div className={styles.statusBarContainerSettings} style={{zIndex: '3'}}>
        <div style={{width: '34px', height: '17px'}}/>
        <img src={ statusBarLogo } alt='' width='34' height='17'/>
        <div>
          <IconButton color='inherit' onClick={this.openSettings} style={{outline: 'none', fontSize: '16px'}} aria-label='Close'>
            <SettingIcon />
          </IconButton>
        </div>
      </div>
    )
  }

  renderContent () {
    switch(this.props.app) {
      case appItems.wallet.id:
        return (
          <div style={{width: '100vw'}}>
            { this.state.dbInit && this.renderWalletView() }
          </div>
        )
      break;
      case appItems.trade.id:
        return (
          <div style={{width: '100vw'}}>
            { this.state.dbInit && this.renderTradeView() }
          </div>
        )
      break;
    }
  }

  renderWalletView () {
    return (
      <div className={styles.appContainer}>
        <div style={{zIndex: '2'}}>
         <AccountList />
        </div>
        <div>
          <Wallet />
        </div>
      </div>
    )
  }

  renderTradeView() {
    return (
      <div className={styles.appContainer}>
        <Trade />
      </div>
    )
  }

  refresh = () => {
    this.props.fetchAccountDetails()
  }

  openSettings = () => {
    this.setState({
      settingsOpen: true
    })
  }

  toggleSettingsDrawer = (open) => () => {
    this.setState({
      settingsOpen: open
    })
  }
}

const mapStateToProps = (state) => {
  return {
    app: getCurrentApp(state)
  }
}

export default connect(mapStateToProps, {
  unlock,
  initializeDB,
  fetchStellarMarketInfo
})(AppView)