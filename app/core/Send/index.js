import React, { Component } from 'react'
import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'

class Send extends Component {

  constructor (props) {
    super()
    this.state = {
      sendAddress: '',
      sendAmount: '',
      displayErrors: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render() {
    return (
      <div>
        { this.renderSendMoneySection() }
      </div>
    )
  }

  renderSendMoneySection () {
    var formStyle = 'form-control'
    if (this.state.displayErrors) {
      formStyle = `form-control sendAssetFormDisplayErrors`
    }

    return (
      <div className={styles.sendAssetFormContainer}>
        <form id='sendAssetForm' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendAddress'>Send to address: </label>
            <input type='text' className={formStyle} placeholder='Send Address'
              id='sendAddress' name='sendAddress' value={this.state.sendAddress} onChange={this.handleChange} required />
          </div>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendAmount'>Amount in XLM: </label>
            <input type='text' className={formStyle} placeholder='Amount in XLM'
              id='sendAmount' name='sendAmount' value={this.state.sendAmount} onChange={this.handleChange} required />
          </div>
          { this.renderSendButtonContent() }
        </form>
      </div>
    )
  }

  renderSendButtonContent() {
    const renderNormalButton = (
      <div className={styles.sendButtonContainer}>
        <button className='btn btn-outline-primary'
                  type='submit'
                  style={{paddingLeft: '3rem', paddingRight: '3rem'}}
                  id="load">
                  Send
        </button>
      </div>
    )
    const renderLoadingButton = (
      <div className={styles.sendButtonContainer}>
        <button className='btn btn-primary'
                  type='submit'
                  style={{paddingLeft: '2rem', paddingRight: '2rem'}}
                  id="load" disabled>
                  <i className='fa fa-spinner fa-spin' style={{marginRight: '0.3rem'}}></i>
                  Sending
        </button>
      </div>
    )

    if (this.props.paymentSending) {
      return renderLoadingButton
    } else {
      return renderNormalButton
    }
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