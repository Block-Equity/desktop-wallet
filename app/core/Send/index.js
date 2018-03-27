import React, { Component } from 'react'
import HoverObserver from 'react-hover-observer'
import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'
import Tooltip from 'material-ui/Tooltip'

class Send extends Component {

  constructor (props) {
    super()
    this.state = {
      sendAddress: '',
      sendAmount: '',
      sendMemoID: '',
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
      <div id={styles.sendAssetFormContainer}>
        <form id='sendAssetForm' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendAddress'>Send to address </label>
            <input type='text' className={formStyle} placeholder='Send Address'
              id='sendAddress' name='sendAddress' value={this.state.sendAddress} onChange={this.handleChange} required />
          </div>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendMemoID'>
              Memo ID (optional)
              <Tooltip id="tooltip-right-start" title="Memo id is required by certain exchanges to transfer funds." placement="right-start">
                 <i className="fa fa-info-circle" style={{marginLeft: '0.25rem'}}> </i>
              </Tooltip>
            </label>
            <input type='number' className={formStyle} placeholder='Memo ID'
              id='sendMemoID' name='sendMemoID' value={this.state.sendMemoID} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendAmount'>Amount in XLM </label>
            <input type='number' className={formStyle} placeholder='Amount in XLM'
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
        <button className='btn btn-primary'
                  type='submit'
                  style={{width: 'inherit', height: '3rem'}}
                  id="load">
                  Send
        </button>
      </div>
    )

    const renderLoadingButton = (
      <div className={styles.sendButtonContainer}>
        <button className='btn btn-primary'
                  type='submit'
                  style={{width: 'inherit', height: '3rem'}}
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
      amount: this.state.sendAmount,
      memoId: this.state.sendMemoID
    }

    this.props.receiveSendPaymentInfo(info)
  }
}

export default Send;