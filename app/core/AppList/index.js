import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'

import Settings from '../Settings'

import { ListGroup, ListGroupItem } from 'reactstrap'
import walletIcon from './icons/menu-wallet.png'
import tradingIcon from './icons/menu-trading.png'
import settingIcon from './icons/menu-settings.png'

import { setCurrentApp } from '../../common/app/actions'

const appItems = [
  { displayLabel: 'Wallet', icon: walletIcon, id: 0 } ,
  { displayLabel: 'Trading', icon: tradingIcon, id: 1 },
  { displayLabel: 'Settings', icon: settingIcon, id: 2 }
]

class AppList extends Component {

  constructor (props) {
    super()
    this.state = ({
      appSelected: 0,
      settingsOpen: false,
    })
    this.toggleSettingsDrawer = this.toggleSettingsDrawer.bind(this)
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <ListGroup>
          { this.renderAppMenu() }
        </ListGroup>
        <Settings setOpen={this.toggleSettingsDrawer(!this.state.settingsOpen)} open={this.state.settingsOpen}/>
      </div>
    )
  }

  renderAppMenu() {
      const listItemStyleNormal = { outline: 'none', borderRadius: '0', backgroundColor: '#1942c9', borderColor: 'rgba(256, 256, 256, 0.06)', color: '#F4F4F4', borderRight: '0', borderLeft: '0' }
      const listItemStyleActive = { ...listItemStyleNormal, backgroundColor: '#0026A2', color: '#FFFFFF' }

      return appItems.map((app, index) => {
        const selected = this.state.appSelected === index ? true : false
        return (
          <ListGroupItem
            key = { index }
            style={ selected ? listItemStyleActive : listItemStyleNormal }
            active={ selected }
            tag='button'
            onClick={ this.handleAppSelection(app, index) }
            action >
            {this.renderAppLabel(app, selected)}
          </ListGroupItem>
        )
      })
  }

  renderAppLabel (app, isActive) {
    return (
      <div className={styles.appContainer}>
        { isActive && (<div className={styles.appContainerActiveIndicator}/>)}
        <img src={app.icon} width='14' height='14' alt='' style={{marginTop: '0.2rem'}} />
        <div className={styles.appLabelContainer}>
          <label style={{ fontSize: '0.85rem', marginBottom: '0rem' }}>
            { app.displayLabel }
          </label>
        </div>
      </div>
    )
  }

  handleAppSelection = (app, index) => event => {
    event.preventDefault()
    this.setState({
      appSelected: index
    })
    if (index === 2) {
      this.openSettings()
    } else {
      this.props.setCurrentApp(index)
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

export default connect(null, {
  setCurrentApp
})(AppList)