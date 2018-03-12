import React, { Component } from 'react'
import styles from './style.css'
import QRCode from 'qrcode.react'
import Paper from 'material-ui/Paper'

const { clipboard } = require('electron');

const QR_CODE_CONTAINER_SIZE = 160

const qrContainer = {
  padding: '1rem',
  marginTop: '1rem',
  marginBottom: '2.5rem'
}

class Receive extends Component {

  constructor (props) {
    super()
    this.state = {
      copyLabelText: 'Copy Public Address'
    }
    this.copyAddress = this.copyAddress.bind(this)
  }

  render() {
    const address = this.props.currentAccount.pKey
    return (
      <div id={ styles.receiveContainer }>
        <Paper style={qrContainer} elevation={4} >
          <QRCode value={ address } size={ QR_CODE_CONTAINER_SIZE } fgColor={'#1E8BBA'} />
        </Paper>
        <div className={ styles.addressLabelContainer }>
          <label className={ styles.addressLabelHeader }>YOUR WALLET ADDRESS</label>
          <label className={ styles.addressLabel }>{address}</label>
        </div>
        <a onClick={this.copyAddress}>{this.state.copyLabelText}</a>
      </div>
    )
  }

  copyAddress(event) {
    clipboard.writeText(this.props.currentAccount.pKey);
    this.setState({copyLabelText:'Copied!'});
    setTimeout(function(){
      this.setState({copyLabelText:'Copy public Address'});
    }.bind(this), 2000);
  }

}

export default Receive;