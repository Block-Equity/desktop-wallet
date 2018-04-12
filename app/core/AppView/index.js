import React, { Component } from 'react'
import styles from './style.css'

//Nav Bar
import NavBar from '../NavBar'
import AccountList from '../AccountList'
import Main from '../Main'
import Settings from '../Settings'

class AppView extends Component {

  constructor (props) {
    super()
    this.state = {
      settingsOpen: false
    }
    this.toggleSettingsDrawer = this.toggleSettingsDrawer.bind(this)
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.contentContainer}>
          <div style={{zIndex: '2'}}>
            <AccountList />
          </div>
          <div className={styles.accountContentContainer}>
            <NavBar isMainView={true} openSettings={this.openSettings}/>
            <Main />
          </div>
        </div>
        <Settings setOpen={this.toggleSettingsDrawer(!this.state.settingsOpen)} open={this.state.settingsOpen}/>
      </div>
    )
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

export default AppView