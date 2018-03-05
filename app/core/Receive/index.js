import React, { Component } from 'react'
import styles from './style.css'
import QRCode from 'qrcode.react'

const QR_CODE_CONTAINER_SIZE = 140

class Receive extends Component {
  render() {
    const address = this.props.currentAccount.pKey
    return (
      <div className={ styles.receiveContainer }>
        <h3>{address}</h3>
        <QRCode value={ address } size={ QR_CODE_CONTAINER_SIZE } />
      </div>
    )
  }
}

export default Receive;