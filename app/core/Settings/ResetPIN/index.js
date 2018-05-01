import React, { Component } from 'react'
import styles from './style.css'
import { getUserPIN, setUserPIN, getPhrase, setPhrase } from '../../../db'

import { CircularProgress } from 'material-ui/Progress'
import Snackbar from 'material-ui/Snackbar'
import Button from 'material-ui/Button'
import ActionButton from '../../Shared/ActionButton'

import { Form, FormGroup, Label, Input } from 'reactstrap';

class ResetPIN extends Component {

  constructor (props) {
    super()
    this.state = {
      oldPIN: '',
      newPIN: '',
      newPINConfirm: '',
      savingPIN: false,
      alertOpen: false,
      alertMessage: ''
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
        { this.renderAlertView() }
      </div>
    )
  }

  handleSubmit(event) {
    event.preventDefault()
    //Save the new PIN in DB and provide confirmation
    const resetPINValues = {
      oldPIN: this.state.oldPIN,
      newPIN: this.state.newPIN,
      newPINConfirm: this.state.newPINConfirm
    }

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
      const { pin } = await getUserPIN()
      console.log(`PIN Saved in DB: ${pin}`)
      if (pin === this.state.oldPIN) {
        //Encrypt mnemonic with new PIN
        //1. Get Mnemonic with old pin
        const { phrase } = await getPhrase(pin)
        //2. Resave mnemonic with new pin
        await setPhrase(phrase, this.state.newPIN)
        //3. Save new PIN to the DB
        await setUserPIN(this.state.newPIN)
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
        console.log(`PIN Doesn't match. Show some error to the user`)
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

  renderAlertView() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.alertOpen}
          autoHideDuration={6000}
          onClose={this.handleAlertClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.alertMessage}</span>}
          action={[
            <Button key="close" color="secondary" size="small"
              onClick={this.handleAlertClose}>
              CLOSE
            </Button>
          ]}
        />
      </div>
    )
  }

  handleAlertOpen (message) {
    this.setState({
      alertOpen: true,
      alertMessage: message
    })
  }

  handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      alertOpen: false
    })
  }

}

export default ResetPIN