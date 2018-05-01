import React, { Component } from 'react'
import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'
import Snackbar from 'material-ui/Snackbar'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import ActionButton from '../Shared/ActionButton'
import { getUserPIN } from '../../db'

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
}
from 'reactstrap'

const submitButtonStyle = {
  width: 'inherit',
  outline:'none',
  height: '2.5rem',
  boxShadow: 'none',
  backgroundImage: 'linear-gradient(to bottom right, #07237A 0%, #0153B6 100%)'
}

class PinModal extends Component {

  constructor (props) {
    super()
    this.state = {
      showPINModal: props.showPINModal,
      invalidPIN: false,
      pinValue: '',
      retrieve: false
    }

    this.togglePINModal = this.togglePINModal.bind(this)
    this.handlePINSubmit = this.handlePINSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  render () {
    var header = this.state.invalidPIN ? 'Invalid PIN. Please try again.' : 'Enter your PIN to complete the transaction.'
    const btnTitle = {
      default: 'Submit PIN',
      processing: 'Checking PIN'
    }

    return (
      <Modal isOpen={this.props.showPINModal} className={this.props.className} centered={true}>
        <ModalHeader style={{boxShadow: 'none'}} toggle={this.togglePINModal}>{header}</ModalHeader>
        <ModalBody>
          <Input type='password' name='pinValue' id='pinValue'
            value={this.state.pinValue} onChange={this.handleChange}
            placeholder='Enter PIN' style={{boxShadow: 'none'}} required />
        </ModalBody>
        <ModalFooter>
          <ActionButton
            processing={ this.state.retrieve }
            title={ btnTitle }
            isForm={ false }
            actionClicked={ this.handlePINSubmit }
          />
        </ModalFooter>
      </Modal>
    )
  }

  togglePINModal() {
    this.props.toggle(!this.props.showPINModal)
  }

  handleChange (event) {
    const target = event.target
    var value = target.value
    const name = target.name
    console.log(`Entered PIN Value: ${value}`)
    value = value.replace(/[^0-9]/g,'')
    this.setState({
      [name]: value
    })
  }

  handlePINSubmit () {
    if (this.state.pinValue.length !== 0) {
      this.setState({
        retrieve: true
      })
      this.checkPIN()
    }
  }

  async checkPIN() {
    const { pin } = await getUserPIN()
    console.log(`PIN Saved in DB: ${pin}`)
    if (pin === this.state.pinValue) {
      this.timer = setTimeout(() => {
        this.setState({
          retrieve: false,
          pinValue: '',
          invalidPIN: false
        })
        this.props.pinSuccessful(true)
      }, 1000)
    } else {
      this.props.pinSuccessful(false)
      this.setState({
        retrieve: false,
        invalidPIN: true
      })
    }
  }
}

export default PinModal