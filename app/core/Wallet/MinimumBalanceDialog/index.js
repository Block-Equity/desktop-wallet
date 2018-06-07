import React, { Component } from 'react'

import { Modal, ModalHeader, ModalBody } from 'reactstrap'

class MinimumBalanceDialog extends Component {
  constructor (props) {
    super()
    this.state = {
      showModal: props.showModal
    }

    this.toggleModal = this.toggleModal.bind(this)
  }

  render() {
    const { minimumBalance } = this.props
    return (
      <Modal isOpen={this.props.showModal} className={this.props.className} centered={true}>
        <ModalHeader style={{boxShadow: 'none'}} toggle={this.toggleModal}>Add Asset</ModalHeader>
        <ModalBody>

        </ModalBody>
      </Modal>
    )
  }

  toggleModal() {
    this.props.toggle(!this.props.showModal)
  }

}

export default MinimumBalanceDialog