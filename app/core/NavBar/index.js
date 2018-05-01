import React, { Component } from 'react'
import styles from './style.css'
import logoIcon from './logo-white.png'
import backIcon from './arrow-back-white.png'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import SettingIcon from 'material-ui-icons/Settings'
import RefreshIcon from 'material-ui-icons/Refresh'

const BACK_IMAGE_SIZE = 16
const LOGO_IMAGE_SIZE = { height: 16, width: 30 }

export default class NavBar extends Component {

  constructor (props) {
    super()
    this.state = {
      isMainView: false
    }
    this.onClose = this.onClose.bind(this)
    this.onOpenSettings = this.onOpenSettings.bind(this)
    this.refreshView = this.refreshView.bind(this)
  }

  render () {
    const appBarStyle = {
      height: this.props.isMainView ? '3.4rem' : '5.5rem',
      backgroundImage: 'linear-gradient(to bottom right, #07237A 0%, #0153B6 100%)',
      boxShadow: 'none'
    }

    const closeButton = (
      <AppBar position='absolute' style={appBarStyle} >
        <Toolbar style={{paddingTop: '2rem'}}>
          <IconButton color='inherit' onClick={this.onClose} style={{outline: 'none', marginBottom: '1rem'}} aria-label='Close'>
            <CloseIcon />
          </IconButton>
          <div style={{width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
            <img src={ logoIcon } width={ LOGO_IMAGE_SIZE.width } height={ LOGO_IMAGE_SIZE.height }
                style={{ marginBottom: '0.6rem' }} alt=''/>
          </div>
        </Toolbar>
      </AppBar>
    )

    const settingsButton = (
      <AppBar position='absolute' style={appBarStyle}>
        <Toolbar>
          <IconButton color='inherit' onClick={this.refreshView} style={{outline: 'none', marginBottom: '0.4rem', marginLeft: '10.5rem', fontSize: '17px'}} aria-label='Close'>
            <RefreshIcon />
          </IconButton>
          <div style={{width: '100%', marginBottom: '0.4rem', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
            <img src={ logoIcon } width={ LOGO_IMAGE_SIZE.width } height={ LOGO_IMAGE_SIZE.height } alt=''/>
          </div>
          <IconButton color='inherit' onClick={this.onOpenSettings} style={{outline: 'none', marginBottom: '0.4rem', marginRight: '-1rem', fontSize: '16px'}} aria-label='Close'>
            <SettingIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    )

    return (
      <div>
        { this.props.isMainView ? settingsButton : closeButton }
      </div>
    )
  }

  onClose (event) {
    event.preventDefault()
    window.location.href = '#'
  }

  onOpenSettings (event) {
    event.preventDefault()
    this.props.openSettings()
  }

  refreshView (event) {
    event.preventDefault()
    this.props.refresh()
  }

}

