import React, { Component } from 'react'
import styles from './style.css'
import logoIcon from './logo-white.png'
import backIcon from './arrow-back-white.png'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import CloseIcon from 'material-ui-icons/Close'

const BACK_IMAGE_SIZE = 16
const LOGO_IMAGE_SIZE = { height: 21, width: 40 }

const appBarStyle = {
  height: '5.5rem',
  backgroundImage: 'linear-gradient(to bottom right, #07237A 0%, #0153B6 100%)'
}

export default class NavBar extends Component {

  constructor (props) {
    super()
    this.onClose = this.onClose.bind(this)
  }

  renderNavBar () {
    return (
      <nav className='navbar navbar-dark'
          style={{ backgroundImage: 'linear-gradient(to bottom right, #07237A 0%, #0153B6 100%)' }}>
        <a className='navbar-brand' href='#'>
          <img src={ backIcon } width={ BACK_IMAGE_SIZE } height={ BACK_IMAGE_SIZE }
              style={{ marginTop: '0.5rem' }} alt=''/>
        </a>
        <div className={ styles.navContentContainer }>
          <img src={ logoIcon } width={ LOGO_IMAGE_SIZE.width } height={ LOGO_IMAGE_SIZE.height }
              style={{ marginBottom: '0.6rem' }} alt=''/>
        </div>
      </nav>
    )
  }

  render () {
    return (
      <AppBar position='absolute' style={appBarStyle}>
        <Toolbar style={{paddingTop: '2rem'}}>
          <IconButton color="inherit" onClick={this.onClose} style={{outline: 'none'}} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <div style={{width: '100%', paddingRight: '2.2rem', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
            <img src={ logoIcon } width={ LOGO_IMAGE_SIZE.width } height={ LOGO_IMAGE_SIZE.height }
                style={{ marginBottom: '0.6rem' }} alt=''/>
          </div>
        </Toolbar>
      </AppBar>
    )
  }

  onClose (event) {
    event.preventDefault()
    window.location.href = '#'
  }

}

