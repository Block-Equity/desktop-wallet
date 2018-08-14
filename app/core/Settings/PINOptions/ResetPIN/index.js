import React, { Component } from 'react'
import styles from './style.css'
import { getPhrase, setPhrase } from '../../../../db'
import { setPIN, getPIN } from '../../../../db/pin'
import ActionButton from '../../../Shared/ActionButton'
import Alert from '../../../Shared/Alert'

import { Form, FormGroup, Label, Input } from 'reactstrap';

import ChevronLeft from 'material-ui-icons/ChevronLeft'

class ResetPIN extends Component {

  constructor (props) {
    super()
    this.state = {
      oldPIN: '',
      newPIN: '',
      newPINConfirm: '',
      savingPIN: false,
      alertOpen: false,
      alertMessage: '',
      alertSuccess: true
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  render() {
    const btnTitle = {
      default: 'Save new PIN',
      processing: 'Saving new PIN'
    }

    return (
      <div>
      <div className={styles.navBar}>
        <h6 className={styles.backNav} onClick={this.props.history.goBack}>Back</h6>
      </div>
      <div id={styles.formContainer}>
        <h6 style={{width: '28rem'}}>
          PIN will used to encrypt your secret keys. Please make sure you choose a PIN that is difficult to guess for others.
        </h6>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label className={styles.formLabel} htmlFor='oldPIN'>Old PIN </Label>
            <Input type='password' placeholder='Old PIN' maxLength='4'
              id='oldPIN' name='oldPIN' value={this.state.oldPIN} onChange={this.handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label className={styles.formLabel} htmlFor='newPIN'>New PIN (4 digits)</Label>
            <Input type='password' placeholder='New PIN' maxLength='4'
              id='newPIN' name='newPIN' value={this.state.newPIN} onChange={this.handleChange} required/>
          </FormGroup>
          <FormGroup>
            <Label className={styles.formLabel} htmlFor='newPINConfirm'>Re-type new PIN to confirm </Label>
            <Input type='password' placeholder='Re-type new PIN' maxLength='4'
              id='newPINConfirm' name='newPINConfirm' value={this.state.newPINConfirm} onChange={this.handleChange} required />
          </FormGroup>
          <ActionButton processing={ this.state.savingPIN } title={ btnTitle } isForm={ true } />
        </Form>
        <Alert
          open={this.state.alertOpen}
          message={this.state.alertMessage}
          success={this.state.alertSuccess}
          close={() => { this.setState({ alertOpen: false })}}
        />
      </div>
      </div>
    )
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({
      savingPIN: true
    })
    this.saveUpdatedPIN()
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

  async saveUpdatedPIN() {
    if (this.state.newPIN === this.state.newPINConfirm) {
      const pin = await getPIN()
      if (pin === this.state.oldPIN) {
        //Encrypt mnemonic with new PIN
        //1. Get Mnemonic with old pin
        const { phrase } = await getPhrase(pin)
        //2. Resave mnemonic with new pin
        await setPhrase(phrase, this.state.newPIN)
        //3. Save new PIN to the DB
        await setPIN(this.state.newPIN)
        this.timer = setTimeout(() => {
          this.handleAlertOpen('New PIN saved!')
          this.setState({
            savingPIN: false,
            oldPIN: '',
            newPIN: '',
            newPINConfirm: ''
          })
        }, 1500)

      } else {
        this.handleAlertOpen('The old PIN you entered is not valid.')
        this.setState({
          savingPIN: false
        })
      }
    } else {
      this.handleAlertOpen('Values for new PIN do not match')
      this.setState({
        savingPIN: false
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

export default ResetPIN