import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'
import ActionButton from '../ActionButton'

import {
  fetchAccountDetails,
  fetchStellarAssetsForDisplay,
  fetchBlockEQTokensForDisplay,
  changeTrustOperation
} from '../../../common/account/actions'

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
}
from 'reactstrap'

const assetType = 'credit_alphanum4'

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
              <FormText color='danger' style={{fontSize: '0.75rem', marginTop: '0.75rem'}}><i className="fa fa-exclamation-triangle" style={{marginRight: '0.15rem', marginLeft: '0.15rem'}}/> Please research asset before trading or sending</FormText>
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
    const asset = {
      asset_code: this.state.assetCode,
      asset_issuer: this.state.issuerAddress
    }
    this.setState({
      processing: true
    })
    this.timer = setTimeout( async () => {
      await this.changeTrust(asset)
      this.setState({
        processing: false
      })
    }, 1500)
  }

  async changeTrust (asset) {
    await this.props.changeTrustOperation(asset)
    await this.props.fetchAccountDetails()
    await this.props.fetchStellarAssetsForDisplay()
    await this.props.fetchBlockEQTokensForDisplay()
    await this.setState({ changeTrustInProcess: false })
    this.props.addAssetSuccessful()
  }

}

export default connect(null, {
  fetchAccountDetails,
  fetchStellarAssetsForDisplay,
  fetchBlockEQTokensForDisplay,
  changeTrustOperation
})(AddAsset)