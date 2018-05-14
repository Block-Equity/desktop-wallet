import React, { Component } from 'react'
import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'
import Snackbar from 'material-ui/Snackbar'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import ActionButton from '../ActionButton'
import { getUserPIN } from '../../../db'

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
}
from 'reactstrap'

class AddAsset extends Component {

  constructor (props) {
    super()
    this.state = {
      showModal: props.showModal,
      processing: false
    }

    //this.toggleModal = this.toggleModal.bind(this)
    //this.handleSubmit = this.handleSubmit.bind(this)
    //this.handleChange = this.handleChange.bind(this)
  }

  render () {
    const btnTitle = {
      default: 'Add asset',
      processing: 'Adding asset...'
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

  toggleModal() {
    this.props.toggle(!this.props.showModal)
  }

  handleChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }

  handlePINSubmit () {
    if (this.state.pinValue.length !== 0) {
      this.setState({
        processing: true
      })
      this.addAsset()
    }
  }

  addAsset () {

  }

}

export default AddAsset