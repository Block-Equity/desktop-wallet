import React, { Component } from 'react'
import styles from './style.css'
import logoIcon from './logo-white.png'
import backIcon from './arrow-back-white.png'

const BACK_IMAGE_SIZE = 16
const LOGO_IMAGE_SIZE = { height: 21, width: 40 }

export default class NavBar extends Component {
  render() {
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
}

