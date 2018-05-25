import React, { Component } from 'react'
import styles from './style.css'
import { CircularProgress } from 'material-ui/Progress'
import Snackbar from 'material-ui/Snackbar'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import ActionButton from '../ActionButton'

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
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

    this.toggleModal = this.toggleModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  render () {
    const btnTitle = {
      default: 'Add Asset',
      processing: 'Adding asset...'
    }

    return (
      <Modal isOpen={this.props.showModal} className={this.props.className} centered={true}>
        <ModalHeader style={{boxShadow: 'none'}} toggle={this.toggleModal}>Add Asset</ModalHeader>
        <ModalBody>
          <Form onSubmit={ this.handleSubmit }>
            <FormGroup>
              <Label className={styles.formLabel} htmlFor='assetCode'>Asset Code </Label>
              <Input type='text' name='assetCode' id='assetCode'
                  value={this.state.assetCode} onChange={this.handleChange}
                  placeholder='Enter asset code' style={{boxShadow: 'none'}} required />
            </FormGroup>
            <FormGroup>
              <Label className={styles.formLabel} htmlFor='issuerAddress'>Issuer Address </Label>
              <Input type='text' name='issuerAddress' id='issuerAddress'
                  value={this.state.issuerAddress} onChange={this.handleChange}
                  placeholder='Enter issuer address' style={{boxShadow: 'none'}} required />
            </FormGroup>
            {' '}
          </Form>
        </ModalBody>
        <ModalFooter>
          <ActionButton
            processing={ this.state.processing }
            title={ btnTitle }
            isForm={ false }
            actionClicked={ this.handleSubmit }
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

  handleSubmit (event) {
    this.setState({
      processing: true
    })
    this.timer = setTimeout( async () => {
      await this.addAsset()
      this.setState({
        processing: false
      })
    }, 2500)
  }

  addAsset () {

  }

}

export default AddAsset