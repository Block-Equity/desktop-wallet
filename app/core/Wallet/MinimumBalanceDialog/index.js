import React, { Component } from 'react'

import { Modal, ModalHeader, ModalBody, Table } from 'reactstrap'

class MinimumBalanceDialog extends Component {
  constructor (props) {
    super()
    this.toggleModal = this.toggleModal.bind(this)
  }

  render() {
    return (
      <Modal isOpen={this.props.showModal} className={this.props.className} centered={true}>
        <ModalHeader style={{boxShadow: 'none'}} toggle={this.toggleModal}>Minimum Balance</ModalHeader>
        <ModalBody>
          { this.props.minimumBalance && this.renderCalculationTable() }
        </ModalBody>
      </Modal>
    )
  }

  renderCalculationTable() {
    const { minimumBalance } = this.props
    return (
      <Table size="sm" bordered>
        <thead>
          <tr>
            <th style={{width: '14rem'}}>Type</th>
            <th style={{width: '6rem', textAlign: 'center'}}>#</th>
            <th style={{textAlign: 'center'}}>XLM</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Base Reserve</td>
            <td style={{textAlign: 'center'}}>1</td>
            <td style={{textAlign: 'center'}}>1</td>
          </tr>
          <tr>
            <td>Trustlines</td>
            <td style={{textAlign: 'center'}}>{ minimumBalance.trustlines.count }</td>
            <td style={{textAlign: 'center'}}>{ minimumBalance.trustlines.amount }</td>
          </tr>
          <tr>
            <td>Offers</td>
            <td style={{textAlign: 'center'}}>{ minimumBalance.offers.count }</td>
            <td style={{textAlign: 'center'}}>{ minimumBalance.offers.amount }</td>
          </tr>
          <tr>
            <td>Signers</td>
            <td style={{textAlign: 'center'}}>{ minimumBalance.signers.count }</td>
            <td style={{textAlign: 'center'}}>{ minimumBalance.signers.amount }</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td></td>
            <td style={{textAlign: 'center'}}><b>{ minimumBalance.minimumBalanceAmount }</b></td>
          </tr>
        </tbody>
      </Table>
    )
  }

  toggleModal() {
    this.props.toggle()
  }

}

export default MinimumBalanceDialog