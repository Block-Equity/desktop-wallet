import React, { Component } from 'react'
import { connect } from 'react-redux'

import isEmpty from 'lodash/isEmpty'
import { unlock } from '../../common/auth/actions'
import { initializeDB } from '../../common/account/actions'
import { getCurrentApp } from '../../common/app/selectors'

//Style
import styles from './style.css'
import NavBar from '../Shared/NavBar'
import Settings from '../Settings'
import AppList from '../AppList'
import Wallet from '../Wallet'
import Trade from '../Trade'
import AccountList from '../Wallet/AccountList'

import statusBarLogo from '../Launch/logo-brand-color.png'

const appItems = {
  wallet: { displayLabel: 'Wallet', id: 0 } ,
  trade: { displayLabel: 'Trading', id: 1 },
  settings: { displayLabel: 'Settings', id: 2 }
}

class AppView extends Component {

  constructor (props) {
    super()
    this.state = {
      dbInit: false
    }
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
          { this.renderContent() }
        </div>
      </div>
    )
  }

  renderContent () {
    switch(this.props.app) {
      case appItems.wallet.id:
        return (
          <div>
            { this.state.dbInit && this.renderWalletView() }
          </div>
        )
      break;
      case appItems.trade.id:
        return (
          <div>
            { this.state.dbInit && this.renderTradeView() }
          </div>
        )
      break;
    }
  }

  renderWalletView () {
    return (
      <div className={styles.appContainer}>
        <div style={{zIndex: '1'}}>
         <AccountList />
        </div>
        <div style={{marginTop: '2.5rem'}}>
          <Wallet />
        </div>
      </div>
    )
  }

  renderTradeView() {
    return (
      <div className={styles.appContainer}>
        <div style={{marginTop: '2.5rem'}}>
          <Trade />
        </div>
      </div>
    )
  }

  refresh = () => {
    this.props.fetchAccountDetails()
  }
}

const mapStateToProps = (state) => {
  return {
    app: getCurrentApp(state)
  }
}

export default connect(mapStateToProps, {
  unlock,
  initializeDB
})(AppView)