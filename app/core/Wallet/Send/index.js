import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './style.css'
import Tooltip from 'material-ui/Tooltip'
import { FormText } from 'reactstrap'

import PinModal from '../../Shared/PinModal'
import ActionButton from '../../Shared/ActionButton'
import Alert from '../../Shared/Alert'

import { get as getPinOptions, GATE_PAYMENT } from '../../../db/pin'

const memoTypeLabel = {
  memoText: 'Memo Text',
  memoId: 'Memo ID'
}

class Send extends Component {

  constructor (props) {
    super()
    this.state = {
      sendAddress: '',
      sendAmount: '',
      sendMemoID: '',
      displayErrors: false,
      showPINModal: false,
      currentAddress: props.currentAccount.pKey,
      alertOpen: false,
      alertMessage: '',
      alertSuccess: true,
      exchangeSelected: undefined
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handlePinSubmission = this.handlePinSubmission.bind(this)
    this.togglePINModal = this.togglePINModal.bind(this)
  }

  componentDidMount() {
    //console.log(`Exchange List: ${JSON.stringify(this.props.exchangeList)}`)
  }

  render() {
    return (
      <div>
        { this.renderSendMoneySection() }
        <PinModal showPINModal={this.state.showPINModal}
                  pinSuccessful={this.handlePinSubmission}
                  toggle={this.togglePINModal} />
        <Alert
          open={this.state.alertOpen}
          message={this.state.alertMessage}
          success={this.state.alertSuccess}
          close={() => { this.setState({ alertOpen: false })}}
        />
      </div>
    )
  }

  renderSendMoneySection () {

    const { currentAccount } = this.props

    var formStyle = 'form-control'
    if (this.state.displayErrors) {
      formStyle = `form-control sendAssetFormDisplayErrors`
    }

    const btnTitle = {
      default: 'Send',
      processing: 'Sending'
    }

    const addressLabelTitle = this.state.exchangeSelected ? `Send to address (${this.state.exchangeSelected.name})` : 'Send to address'
    const sendMemoTypeTitle = this.state.exchangeSelected ? `${memoTypeLabel[this.state.exchangeSelected.memo]}` : 'Memo ID or Text (optional)'
    const sendMemoTypePlaceholderTitle = this.state.exchangeSelected ? `${memoTypeLabel[this.state.exchangeSelected.memo]}` : 'Memo ID or Text'

    return (
      <div id={styles.sendAssetFormContainer}>
        <form id='sendAssetForm' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendAddress'>Send to address </label>
            <input type='text' className={formStyle} placeholder='Send Address'
              id='sendAddress' name='sendAddress' value={this.state.sendAddress} onChange={this.handleChange} required />
            {this.state.exchangeSelected && <FormText color='info' style={{fontSize: '0.65rem', marginTop: '0.5rem'}}><i className="fa fa-exclamation-triangle" style={{marginRight: '0.15rem', marginLeft: '0.15rem'}}/> Address identified for <b><u>{this.state.exchangeSelected.name}</u></b></FormText>}
          </div>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendMemoID'>
              {sendMemoTypeTitle}
              <Tooltip id="tooltip-right-start" title="Memo id or Text is required by certain exchanges to transfer funds." placement="right-start">
                 <i className="fa fa-info-circle" style={{marginLeft: '0.25rem'}}> </i>
              </Tooltip>
            </label>
            <input type='text' className={formStyle} placeholder={sendMemoTypePlaceholderTitle}
              id='sendMemoID' name='sendMemoID' value={this.state.sendMemoID} onChange={this.handleChange} required={this.state.exchangeSelected}/>
          </div>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendAmount'>{`Amount in ${currentAccount.asset_code}`} </label>
            <input type='text' className={formStyle} placeholder={`Amount in ${currentAccount.asset_code}`}
              id='sendAmount' name='sendAmount' value={this.state.sendAmount} onChange={this.handleChange} required />
          </div>
          <ActionButton processing={ this.props.paymentSending } title={ btnTitle } isForm={ true } />
        </form>
      </div>
    )
  }

  handleChange (event) {
    const target = event.target
    var value = target.value
    const name = target.name
    if (name==='sendAmount') {
      value = value.replace(/[^0.001-9]/g, '')
    }
    if (name==='sendAddress') {
      if (this.props.exchangeList.hasOwnProperty(value)) {
        const exchange = this.props.exchangeList[value]
        this.setState({
          exchangeSelected: exchange
        })
      } else {
        this.setState({
          exchangeSelected: undefined
        })
      }
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

    if (this.state.sendAddress === this.state.currentAddress) {
      this.setState({
        alertOpen: true,
        alertSuccess: false,
        alertMessage: 'Send address cannot be your own address.',
        sendAddress: ''
      })
    } else {
      const info = {
        destination: this.state.sendAddress,
        amount: this.state.sendAmount,
        memoValue: this.state.sendMemoID
      }

      getPinOptions().then(pinOptions => {
        if(!pinOptions[GATE_PAYMENT]) {
          this.props.receiveSendPaymentInfo(info)
        } else {
          this.setState({
            info,
            showPINModal: true
          })
        }
      })

    }
  }

  togglePINModal (event) {
    this.setState({
      showPINModal: !this.state.showPINModal
    })
  }

  handlePinSubmission (success) {
    if (success) {
      this.togglePINModal()
      this.props.receiveSendPaymentInfo(this.state.info)
    }
  }

}

export default Send