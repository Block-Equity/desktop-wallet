import React, { Component } from 'react'
import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'
import Snackbar from 'material-ui/Snackbar'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
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
    return (
      <Modal isOpen={this.props.showPINModal} toggle={this.togglePINModal} className={this.props.className} centered={true}>
        <ModalHeader style={{boxShadow: 'none'}} toggle={this.togglePINModal}>{header}</ModalHeader>
        <ModalBody>
          <Input type='password' name='pinValue' id='pinValue'
            value={this.state.pinValue} onChange={this.handleChange}
            placeholder='Enter PIN' style={{boxShadow: 'none'}} required />
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
                  style={submitButtonStyle}
                  id="load">
                  Submit PIN
        </button>
      </div>
    )

    const renderLoadingButton = (
      <div className={styles.saveButtonContainer}>
        <button className='btn btn-primary'
                  type='submit'
                  style={submitButtonStyle}
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

  handlePINSubmit (event) {
    event.preventDefault()
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
          invalidPIN: false,
          showPINModal: false
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