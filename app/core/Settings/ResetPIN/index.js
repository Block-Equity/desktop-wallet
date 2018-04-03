import React, { Component } from 'react'
import styles from './style.css'
import { getUserPIN, setUserPIN } from '../../../db'

import { CircularProgress } from 'material-ui/Progress'
import Snackbar from 'material-ui/Snackbar'
import Button from 'material-ui/Button'

import { Form, FormGroup, Label, Input } from 'reactstrap';

class ResetPIN extends Component {

  constructor (props) {
    super()
    this.state = {
      oldPIN: '',
      newPIN: '',
      newPINConfirm: '',
      savingPIN: false,
      alertOpen: true,
      alertMessage: 'Test'
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  render() {
    return (
      <div id={styles.formContainer}>
        <h6>
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
          { this.renderSaveButtonContent() }
        </Form>
        { this.renderAlertView() }
      </div>
    )
  }

  renderSaveButtonContent() {
    const renderNormalButton = (
      <div className={styles.saveButtonContainer}>
        <button className='btn btn-primary'
                  type='submit'
                  style={{width: 'inherit', height: '3rem'}}
                  id="load">
                  Save
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
                  Saving PIN
        </button>
      </div>
    )

    if (this.state.savingPIN) {
      return renderLoadingButton
    } else {
      return renderNormalButton
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    //Save the new PIN in DB and provide confirmation
    const resetPINValues = {
      oldPIN: this.state.oldPIN,
      newPIN: this.state.newPIN,
      newPINConfirm: this.state.newPINConfirm
    }

    console.log(`Reset PIN Values: ${JSON.stringify(resetPINValues)}`)
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
        //Save new PIN to the DB
        await setUserPIN(this.state.newPIN)
        this.setState({
          oldPIN: '',
          newPIN: '',
          newPINConfirm: ''
        })
        this.props.close()
      } else {
        console.log(`PIN Doesn't match. Show some error to the user`)
      }
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
          onClose={this.handleSnackBarClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.alertMessage}</span>}
          action={[
            <Button key="close" color="secondary" size="small"
              onClick={this.handleSnackBarClose}>
              CLOSE
            </Button>
          ]}
        />
      </div>
    )
  }

  handleSnackBarOpen (message) {
    this.setState({
      alertOpen: true,
      alertMessage: message
    })
  }

  handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ alertOpen: false });
  }

}

export default ResetPIN