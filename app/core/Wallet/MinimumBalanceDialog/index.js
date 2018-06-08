import React, { Component } from 'react'

import { Modal, ModalHeader, ModalBody, Table, Card, Col } from 'reactstrap'

class MinimumBalanceDialog extends Component {
  constructor (props) {
    super()
    this.toggleModal = this.toggleModal.bind(this)
  }

  render() {
    return (
      <Modal isOpen={this.props.showModal} className={this.props.className} centered={true}>
        <ModalHeader style={{boxShadow: 'none'}} toggle={this.toggleModal}>Balance Summary for XLM</ModalHeader>
        <ModalBody>
          { this.props.account.minimumBalance && this.renderSummary() }
          { this.props.account.minimumBalance && this.renderCalculationTable() }
        </ModalBody>
      </Modal>
    )
  }

  renderSummary() {
    const { account } = this.props
    const { minimumBalance } = account
    const availableBalanceCalc = account.balance - account.minimumBalance.minimumBalanceAmount
    const availableBalanceDisplay = availableBalanceCalc > 0 ? availableBalanceCalc : 0

    const summaryContainerCardStyle = { backgroundColor: '#F0F6FA', borderColor: '#ECEEEF', marginBottom: '1rem', marginTop: '0.75rem', padding: '0rem' }
    const summaryContainerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem' }
    const summaryContainerHeaderStyle = { fontSize: '0.75rem', marginTop: '0.5rem'}
    const summaryContainerLabelStyle = { marginTop: '-0.25rem', marginBottom: '0.35rem', fontWeight: '700'}
    return (
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '0.75rem'}}>
        <Col sm='4'>
          <Card body style={ summaryContainerCardStyle }>
            <div style={summaryContainerStyle}>
              <h6 style={summaryContainerHeaderStyle}>{`Total Balance`}</h6>
              <label style={summaryContainerLabelStyle}>{`${account.balance}`}</label>
            </div>
          </Card>
        </Col>
        <Col sm='4'>
          <Card body style={ summaryContainerCardStyle }>
            <div style={summaryContainerStyle}>
              <h6 style={summaryContainerHeaderStyle}>{`Minimum Balance`}</h6>
              <label style={summaryContainerLabelStyle}>{`${minimumBalance.minimumBalanceAmount}`}</label>
            </div>
          </Card>
        </Col>
        <Col sm='4'>
          <Card body style={ summaryContainerCardStyle }>
            <div style={summaryContainerStyle}>
              <h6 style={summaryContainerHeaderStyle}>{`Available Balance`}</h6>
              <label style={summaryContainerLabelStyle}>{`${availableBalanceDisplay}`}</label>
            </div>
          </Card>
        </Col>
      </div>
    )
  }

  renderCalculationTable() {
    const { account } = this.props
    const { minimumBalance } = account
    return (
      <Table size='sm' bordered style={{fontSize: '0.85rem'}}>
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
            <td style={{textAlign: 'center'}}>2</td>
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
            <td><b>Total Minimum Balance</b></td>
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