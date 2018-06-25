import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'
import Snackbar from 'material-ui/Snackbar'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'

import PinModal from '../../Shared/PinModal'
import ActionButton from '../../Shared/ActionButton'

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
      exchangeName: '',
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
        { this.renderAlertView() }
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

    const addressLabelTitle = this.state.exchangeName.length === 0 ? 'Send to address' : `Send to address (${this.state.exchangeName})`

    return (
      <div id={styles.sendAssetFormContainer}>
        <form id='sendAssetForm' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendAddress'>{ addressLabelTitle } </label>
            <input type='text' className={formStyle} placeholder='Send Address'
              id='sendAddress' name='sendAddress' value={this.state.sendAddress} onChange={this.handleChange} required />
          </div>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendMemoID'>
              Memo ID or Text (optional)
              <Tooltip id="tooltip-right-start" title="Memo id or Text is required by certain exchanges to transfer funds." placement="right-start">
                 <i className="fa fa-info-circle" style={{marginLeft: '0.25rem'}}> </i>
              </Tooltip>
            </label>
            <input type='text' className={formStyle} placeholder='Memo ID or Text'
              id='sendMemoID' name='sendMemoID' value={this.state.sendMemoID} onChange={this.handleChange} />
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
          exchangeName: exchange.exchangeName,
          exchangeSelected: exchange
        })
      } else {
        this.setState({
          exchangeName: '',
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
        alertMessage: 'Send address cannot be your own address.',
        sendAddress: ''
      })
    } else {
      const info = {
        destination: this.state.sendAddress,
        amount: this.state.sendAmount,
        memoValue: this.state.sendMemoID
      }
      this.setState({
        info,
        showPINModal: true
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

  renderAlertView() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.alertOpen}
          autoHideDuration={6000}
          onClose={this.handleAlertClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.alertMessage}</span>}
          action={[
            <Button key="close" color="secondary" size="small"
              onClick={this.handleAlertClose}>
              CLOSE
            </Button>
          ]}
        />
      </div>
    )
  }

  handleAlertOpen (message) {
    this.setState({
      alertOpen: true,
      alertMessage: message
    })
  }

  handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      alertOpen: false
    })
  }

}

export default Send