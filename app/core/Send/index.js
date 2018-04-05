import React, { Component } from 'react'
import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'
import Tooltip from 'material-ui/Tooltip'
import { getUserPIN } from '../../db'

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
}
from 'reactstrap'

class Send extends Component {

  constructor (props) {
    super()
    this.state = {
      sendAddress: '',
      sendAmount: '',
      sendMemoID: '',
      displayErrors: false,
      showPINModal: false,
      modalHeader: 'Enter your PIN to complete the transaction',
      invalidPIN: false,
      pinValue: '',
      retrieve: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.togglePINModal = this.togglePINModal.bind(this)
    this.handlePINSubmit = this.handlePINSubmit.bind(this)
  }

  render() {
    return (
      <div>
        { this.renderSendMoneySection() }
        { this.renderPINModal() }
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
            <input type='text' className={formStyle} placeholder='Memo ID'
              id='sendMemoID' name='sendMemoID' value={this.state.sendMemoID} onChange={this.handleChange} />
          </div>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendAmount'>Amount in XLM </label>
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
    var value = target.value
    const name = target.name
    if (name==='sendAmount' || name==='sendMemoID') {
      value = value.replace(/[^0.001-9]/g, '')
    }
    if (name==='pinValue') {
      value = value.replace(/[^0-9]/g,'')
    }
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

    this.setState({
      info,
      showPINModal: true
    })

  }

  renderPINModal () {
    var header = this.state.invalidPIN ? 'Invalid PIN. Please try again.' : 'Enter your PIN to complete the transaction.'
    return (
      <Modal isOpen={this.state.showPINModal} toggle={this.togglePINModal} className={this.props.className} centered={true}>
        <ModalHeader toggle={this.togglePINModal}>{header}</ModalHeader>
        <ModalBody>
          <Input type='password' name='pinValue' id='pinValue'
            value={this.state.pinValue} onChange={this.handleChange}
            placeholder='Enter PIN' required />
        </ModalBody>
        <ModalFooter>
          { this.renderSaveButtonContent() }
        </ModalFooter>
      </Modal>
    )
  }

  renderSaveButtonContent() {
    const renderNormalButton = (
      <div className={styles.saveButtonContainer}>
        <button className='btn btn-primary'
                  type='submit'
                  onClick={this.handlePINSubmit}
                  style={{width: 'inherit', height: '3rem'}}
                  id="load">
                  Submit PIN
        </button>
      </div>
    )

    const renderLoadingButton = (
      <div className={styles.saveButtonContainer}>
        <button className='btn btn-primary'
                  type='submit'
                  style={{width: 'inherit', height: '3rem'}}
                  id="load" disabled>
                  <CircularProgress style={{ color: '#FFFFFF', marginRight: '0.75rem' }} thickness={ 5 } size={ 15 } />
                  Checking PIN
        </button>
      </div>
    )

    if (this.state.retrieve) {
      return renderLoadingButton
    } else {
      return renderNormalButton
    }
  }

  togglePINModal(event) {
    event.preventDefault()
    this.setState({
      showPINModal: !this.state.showPINModal
    })
  }

  handlePINSubmit (event) {
    event.preventDefault()
    this.setState({
      retrieve: true
    })
    this.checkPIN()
  }

  async checkPIN() {
    const { pin } = await getUserPIN()
    console.log(`PIN Saved in DB: ${pin}`)
    if (pin === this.state.pinValue) {
      //TODO: Delete Wallet
      this.timer = setTimeout(() => {
        this.setState({
          retrieve: false,
          pinValue: '',
          invalidPIN: false
        })
        this.props.receiveSendPaymentInfo(this.state.info)
      }, 1000)
    } else {
      //Show alert for invalid PIN
      this.setState({
        retrieve: false,
        invalidPIN: true
      })
    }
  }

}

export default Send