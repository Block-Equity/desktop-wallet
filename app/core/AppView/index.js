import React, { Component } from 'react'
import { connect } from 'react-redux'

import isEmpty from 'lodash/isEmpty'
import { unlock } from '../../common/auth/actions'
import { initializeDB } from '../../common/account/actions'

//Style
import styles from './style.css'
import NavBar from '../NavBar'
import AccountList from '../Wallet/AccountList'
import AppList from '../AppList'
import Wallet from '../Wallet'
import Settings from '../Settings'
import statusBarLogo from '../Launch/logo-brand-color.png'

class AppView extends Component {

  constructor (props) {
    super()
    this.state = {
      settingsOpen: false,
      dbInit: false
    }
    this.toggleSettingsDrawer = this.toggleSettingsDrawer.bind(this)
  }

  async componentDidMount () {
    try {
      await this.props.unlock()
      await this.props.initializeDB()
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
        <div className={styles.statusBarContainer} style={{zIndex: '3'}}>
          <img src={ statusBarLogo } alt='' width='34' height='17'/>
        </div>
        <div className={styles.contentContainer}>
          <div style={{zIndex: '2'}}>
            <AppList />
          </div>
          <div className={styles.accountContentContainer}>
            <div className={styles.appContainer}>
              <div style={{zIndex: '1'}}>
                { this.renderAccountListView() }
              </div>
              <div style={{marginTop: '2.5rem'}}>
                { this.renderWalletView() }
              </div>
            </div>
          </div>
        </div>
        <Settings setOpen={this.toggleSettingsDrawer(!this.state.settingsOpen)} open={this.state.settingsOpen}/>
      </div>
    )
  }

  renderWalletView () {
    if (this.state.dbInit) {
      return (
        <Wallet />
      )
    }
  }

  renderAccountListView () {
    if (this.state.dbInit) {
      return (
        <AccountList />
      )
    }
  }

  openSettings = () => {
    this.setState({
      settingsOpen: true
    })
  }

  refresh = () => {
    this.props.fetchAccountDetails()
  }

  toggleSettingsDrawer = (open) => () => {
    this.setState({
      settingsOpen: open
    })
  }
}

export default connect(null, {
  unlock,
  initializeDB
})(AppView)