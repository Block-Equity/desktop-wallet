import React, { Component } from 'react'
import styles from './style.css'

import { unlock } from '../../common/auth/actions'
import { initializeDB } from '../../common/account/actions'
import { getAccounts } from '../../common/account/selectors'

import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

//Nav Bar
import NavBar from '../NavBar'
import AccountList from '../AccountList'
import Main from '../Main'
import Settings from '../Settings'

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
        <div className={styles.contentContainer}>
          <div style={{zIndex: '2'}}>
            { this.renderAccountListView() }
          </div>
          <div className={styles.accountContentContainer}>
            <NavBar isMainView={true} openSettings={this.openSettings}/>
            { this.renderMainView() }
          </div>
        </div>
        <Settings setOpen={this.toggleSettingsDrawer(!this.state.settingsOpen)} open={this.state.settingsOpen}/>
      </div>
    )
  }

  renderMainView () {
    if (this.state.dbInit) {
      return (
        <Main />
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

  toggleSettingsDrawer = (open) => () => {
    this.setState({
      settingsOpen: open
    })
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    accounts: getAccounts(state)
  }
}

export default connect(null, {
  unlock,
  initializeDB
})(AppView)