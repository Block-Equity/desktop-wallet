import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import styles from './style.css'
import { clearAllUserInfo } from '../../../db'
import { getPIN } from '../../../db/pin'
import { logout } from '../../../common/auth/actions'

import { CircularProgress } from 'material-ui/Progress'
import Alert from '../../Shared/Alert'
import { Form, FormGroup, Label, Input } from 'reactstrap';

class DeleteWallet extends Component {

  constructor (props) {
    super()
    this.state = {
      pinValue: '',
      retrieve: false,
      alertOpen: false,
      alertMessage: '',
      alertSuccess: true,
      walletDeleted: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  render() {
    if (this.state.walletDeleted) {
      return <Redirect to='/' />
    }
    return (
      <div id={styles.formContainer}>
        <h6 style={{width: '28rem'}}>
          Please enter your PIN to delete your wallet.
        </h6>
        <div style={{width: '28rem', marginBottom: '1.5rem', fontWeight: '300'}}>
          <b>Warning:</b> Deleting your wallet will wipe the information from this machine.
          To view your wallet, you will have to go through the restoration process again.
        </div>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Input type='password' placeholder='Your PIN' maxLength='4'
              id='pinValue' name='pinValue' value={this.state.pinValue} onChange={this.handleChange} required />
          </FormGroup>
          { this.renderSaveButtonContent() }
        </Form>
        <Alert
          open={this.state.alertOpen}
          message={this.state.alertMessage}
          success={this.state.alertSuccess}
          close={() => { this.setState({ alertOpen: false })}}
        />
      </div>
    )
  }

  renderSaveButtonContent() {
    const renderNormalButton = (
      <div className={styles.saveButtonContainer}>
        <button className='btn btn-outline-danger'
                  type='submit'
                  style={{width: 'inherit', height: '3rem'}}
                  id="load">
                  Delete Wallet
        </button>
      </div>
    )

    const renderLoadingButton = (
      <div className={styles.saveButtonContainer}>
        <button className='btn btn-primary'
                  type='submit'
                  style={{width: 'inherit', height: '3rem'}}
                  id="load" disabled>
                  <CircularProgress style={{ color: '#FFFFFF', marginRight: '0.75rem' }} thickness={ 5 } size={ 15 } />
                  Deleting Wallet
        </button>
      </div>
    )

    if (this.state.retrieve) {
      return renderLoadingButton
    } else {
      return renderNormalButton
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    //Save the new PIN in DB and provide confirmation
    const resetPINValues = {
      pinValue: this.state.pinValue
    }
    this.setState({
      retrieve: true
    })
    this.checkPIN()
  }

  handleChange(event) {
    const target = event.target
    const name = target.name
    var value = target.value
    value = value.replace(/[^0-9]/g,'')
    this.setState({
      [name]: value
    })
  }

  async checkPIN() {
      const pin  = await getPIN()
      console.log(`PIN Saved in DB: ${pin}`)
      if (pin === this.state.pinValue) {
        //TODO: Delete Wallet
        await clearAllUserInfo()
        this.timer = setTimeout(() => {
          this.setState({
            retrieve: false,
            pinValue: '',
            walletDeleted: true
          })
          window.location.reload()
        }, 500)
      } else {
        this.handleAlertOpen('Invalid PIN.')
        this.setState({
          retrieve: false
        })
      }
  }

  handleAlertOpen (message) {
    this.setState({
      alertOpen: true,
      alertMessage: message,
      alertSuccess: false
    })
  }

}

export default connect(null, {
  logout
})(DeleteWallet)