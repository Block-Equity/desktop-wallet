import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

//Material Design
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Chip from 'material-ui/Chip';

import styles from './style.css'
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input }
from 'reactstrap';

import logoIcon from './images/logo-white.png'

const sampleWords = [
  { key: 0, label: 'travel' },
  { key: 1, label: 'script' },
  { key: 2, label: 'glass' },
  { key: 3, label: 'tenant' },
  { key: 4, label: 'hood' },
  { key: 5, label: 'napkin' },
  { key: 6, label: 'path' },
  { key: 7, label: 'inform' },
  { key: 8, label: 'ensure' },
  { key: 9, label: 'tenant' },
  { key: 10, label: 'interest' },
  { key: 11, label: 'upon' },
  { key: 12, label: 'travel' },
  { key: 13, label: 'script' },
  { key: 14, label: 'glass' },
  { key: 15, label: 'tenant' },
  { key: 16, label: 'hood' },
  { key: 17, label: 'napkin' },
  { key: 18, label: 'path' },
  { key: 19, label: 'inform' },
  { key: 20, label: 'ensure' },
  { key: 21, label: 'tenant' },
  { key: 22, label: 'interest' },
  { key: 23, label: 'upon' }
]

const font = "'Lato', sans-serif";
const materialStyles = theme => ({
  chip: {
    margin: theme.spacing.unit / 2,
    padding: theme.spacing.unit
  },
});

const INITIAL_ACCOUNT_CREATION_STAGE = 0
const INITIAL_ACCOUNT_CREATION_VALIDATION_STEP = 0

class AccountCreation extends Component {

  constructor (props) {
    super()
    this.state = {
      accountCreationStage: {
        pin: {
          valueInitial: undefined,
          valueConfirm: undefined,
          key: 0,
          progressValue: 25,
          progressTitle: 'Step 1 of 4'
        },
        mnemonic: {
          value: undefined,
          key: 1,
          progressValue: 50,
          progressTitle: 'Step 2 of 4'
        },
        passphrase: {
          value: undefined,
          key: 2,
          progressValue: 75,
          progressTitle: 'Step 3 of 4'
        },
        validation: {
          value: {
            step1: {isValidate: false, key: 0},
            step2: {isValidate: false, key: 1},
            step3: {isValidate: false, key: 2},
            step4: {isValidate: false, key: 3},
            step5: {isValidate: false, key: 4},
          },
          key: 3,
          currentValidationStep: INITIAL_ACCOUNT_CREATION_VALIDATION_STEP,
          progressValue: 100,
          progressTitle: 'Step 4 of 4'
        }
      },
      currentStage: INITIAL_ACCOUNT_CREATION_STAGE,
      showModal: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handlePINSubmit = this.handlePINSubmit.bind(this)
    this.handleWriteMnemonicSubmit = this.handleWriteMnemonicSubmit.bind(this)
    this.togglePassphraseModal = this.togglePassphraseModal.bind(this)
  }

  render() {
    return (
      <div className={styles.container}>
        <nav className='navbar navbar-dark' style={{background: '#0F547E'}}>
          <div className={styles.navContentContainer}>
            <img src={logoIcon} width='40' height='21' style={{marginBottom: '0.5rem'}} alt=""/>
          </div>
        </nav>
        <div style={{margin: '1rem', textAlign: 'center'}}>
          { this.renderContent(this.state.currentStage) }
        </div>
      </div>
    )
  }

  renderContent(key) {
    switch(key) {
      case this.state.accountCreationStage.pin.key:
        return (
          this.renderPINView()
        )
      break;
      case this.state.accountCreationStage.mnemonic.key:
        return (
          this.renderMnemonicView()
        )
      break;
      case this.state.accountCreationStage.passphrase.key:
      break;
      case this.state.accountCreationStage.validation.key:
      break;
    }
  }

  //region 1. PIN View
  renderPINView() {
    const {progressValue, progressTitle, valueInitial} = this.state.accountCreationStage.pin;
    return (
      <div id={styles.contentContainer}>
        { this.renderProgressView(progressValue, progressTitle)}
        <h4> Create a 4 digit PIN </h4>
        <h6>
          PIN will used to encrypt your secret keys. Please make sure you choose a PIN that is difficult to guess for others.
        </h6>
        <form id='sendAssetForm' onSubmit={this.handlePINSubmit}>
          <div className='form-group input-group input-group-lg'>
            <input type='password' maxLength='4' style={{outline: 'none', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem', marginLeft: '6rem', marginRight: '6rem'}} className="form-control" placeholder='Enter PIN e.g. 3194'
              id='sendAddress' name='sendAddress' value={valueInitial} onChange={this.handleChange} required />
          </div>
          <button style={{padding: '0.5rem', paddingLeft: '3.5rem', paddingRight: '3.5rem'}} type="submit" className="btn btn-outline-dark">
            Done
          </button>
        </form>
      </div>
    )
  }

  handleChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }

  handlePINSubmit (event) {
    event.preventDefault()
    this.setState({
      currentStage: 1
    })
  }
  //endregion

  //region 2. Mnemonic View
  renderMnemonicView() {
    const {progressValue, progressTitle} = this.state.accountCreationStage.mnemonic;
    return (
      <div id={styles.contentContainer}>
        { this.renderProgressView(progressValue, progressTitle)}
        <h4> Recovery Phrase </h4>
        <h6>
          The phrase is case sensitive. Please make sure you <b>write down and save your recovery phrase</b>. You will need this phrase to use and restore your wallet.
        </h6>
        <div className={styles.chipContainer}>
          {sampleWords.map(data => {
            return (
              <Chip
                key={data.key}
                label={`${data.label}`}
                className={materialStyles.chip}
                style={{fontFamily: font, fontWeight:'400', fontSize:'0.75rem', letterSpacing: '0.03rem',
                  marginLeft: '0.35rem', marginTop: '0.35rem', marginBottom: '0.35rem',
                  backgroundColor:'#D3DBE0', color:'#555555', borderColor: '#C3D0D9'}}
              />
            );
          })}
        </div>
        <div id={styles.mnemonicActionContainer}>
          <button onClick={this.handleWriteMnemonicSubmit} style={{padding: '0.5rem', paddingLeft: '2.5rem', paddingRight: '2.5rem'}} type="button" className="btn btn-outline-dark">
            Yes, I have written it down.
          </button>
          <a onClick={this.togglePassphraseModal}>Advanced Security ></a>
          { this.renderPassphraseModal() }
        </div>
      </div>
    )
  }

  handleWriteMnemonicSubmit (event) {
    event.preventDefault()
    this.setState({
      currentStage: 0
    })
  }

  renderPassphraseModal () {
    return (
      <Modal isOpen={this.state.showModal} toggle={this.togglePassphraseModal} className={this.props.className} centered={true}>
        <ModalHeader toggle={this.togglePassphraseModal}>Enter a passphrase</ModalHeader>
        <ModalBody>
          <Form>
            <Input type="password" name="password" id="passphrase" placeholder="Enter passphrase" />
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button outline color="dark" onClick={this.togglePassphraseModal}>Submit</Button>{' '}
          <Button outline color="danger" onClick={this.togglePassphraseModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }

  togglePassphraseModal() {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  //endregion

  //region 3. Validation View
  renderValidationView() {
    const {progressValue, progressTitle, valueInitial} = this.state.accountCreationStage.validation;
    return (
      <div id={styles.contentContainer}>
        { this.renderProgressView(progressValue, progressTitle)}
        <h4> Enter the 7th word of the recovery phrase </h4>
        <form id='sendAssetForm' onSubmit={this.handlePINSubmit}>
          <div className='form-group input-group input-group-lg'>
            <input type='password' maxLength='4' style={{outline: 'none', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem', marginLeft: '6rem', marginRight: '6rem'}}
              className="form-control" placeholder='Enter recovery word' value={valueInitial} onChange={this.handleChange} required />
          </div>
          <button style={{padding: '0.5rem', paddingLeft: '3.5rem', paddingRight: '3.5rem'}} type="submit" className="btn btn-outline-dark">
            Next
          </button>
        </form>
      </div>
    )
  }
  //endregion

  //Re-usable components - TODO - put them in their own class....but for now this will do.
  renderProgressView(value, label) {
    return (
      <div className="progress" style={{height: '35px', marginBottom: '2rem'}}>
        <div className="progress-bar bg-info" role="progressbar" style={{width: `${value}%`}}
          aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">{label}</div>
      </div>
    )
  }
}

export default connect(null, null)(AccountCreation)