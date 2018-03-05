import React, { Component } from 'react'
import styles from './style.css'

class Send extends Component {

  constructor (props) {
    super()
    this.state = {
      sendAddress: '',
      sendAmount: '',
      invalid: false,
      displayErrors: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render() {
    const address = this.props.currentAccount.pKey
    return (
      <div className={ styles.receiveContainer }>
        <h3>{address}</h3>
        <QRCode value={ address } size={ QR_CODE_CONTAINER_SIZE } />
      </div>
    )
  }

  renderSendMoneySection () {
    // Handle form errors
    const { invalid, displayErrors } = this.state

    var formStyle = ''

    if (displayErrors) {
      formStyle = styles.sendAssetFormDisplayErrors
    }

    return (
      <div className={styles.sendAssetFormContainer}>
        <form id='sendAssetForm' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label className={this.sendAssetFormLabel} htmlFor='sendAddress'>Send to address: </label>
            <input type='text' className='form-control' placeholder='Send Address'
              id='sendAddress' name='sendAddress' value={this.state.sendAddress} onChange={this.handleChange} required />
          </div>
          <div className='form-group'>
            <label className={this.sendAssetFormLabel} htmlFor='sendAmount'>Amount in XLM: </label>
            <input type='text' className='form-control' placeholder='Amount in XLM'
              id='sendAmount' name='sendAmount' value={this.state.sendAmount} onChange={this.handleChange} required />
          </div>
          <button className='btn btn-outline-success' type='submit'>Send</button>
        </form>
      </div>
    )
  }

  handleChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }

  handleSubmit (event) {
    event.preventDefault()

    //Validation
    if (!event.target.checkValidity()) {
       this.setState({
         invalid: true,
         displayErrors: true
       })
       return
    }

    //Callback to the parent component
    const info = {
      destination: this.state.sendAddress,
      amount: this.state.sendAmount
    }

    this.props.receiveSendPaymentInfo(info)
  }
}

export default Send;