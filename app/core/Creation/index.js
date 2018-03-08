import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

//Material Design
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import styles from './style.css'
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input }
from 'reactstrap';

import logoIcon from './images/logo-white.png'

const sampleWords = [
  { key: 0, label: 'travel', numeric: '1st' },
  { key: 1, label: 'script', numeric: '2nd' },
  { key: 2, label: 'glass', numeric: '3rd' },
  { key: 3, label: 'tenant', numeric: '4th' },
  { key: 4, label: 'hood', numeric: '5th' },
  { key: 5, label: 'napkin', numeric: '6th' },
  { key: 6, label: 'path', numeric: '7th' },
  { key: 7, label: 'inform', numeric: '8th' },
  { key: 8, label: 'ensure', numeric: '9th'},
  { key: 9, label: 'tenant', numeric: '10th' },
  { key: 10, label: 'interest', numeric: '11th' },
  { key: 11, label: 'upon', numeric: '12th' },
  { key: 12, label: 'travel', numeric: '13th' },
  { key: 13, label: 'script', numeric: '14th' },
  { key: 14, label: 'glass', numeric: '15th' },
  { key: 15, label: 'tenant', numeric: '16th' },
  { key: 16, label: 'hood', numeric: '17th' },
  { key: 17, label: 'napkin', numeric: '18th' },
  { key: 18, label: 'path', numeric: '19th' },
  { key: 19, label: 'inform', numeric: '20th' },
  { key: 20, label: 'ensure', numeric: '21st' },
  { key: 21, label: 'tenant', numeric: '22nd' },
  { key: 22, label: 'interest', numeric: '23rd' },
  { key: 23, label: 'upon', numeric: '24th' }
]

const font = "'Lato', sans-serif";
const materialStyles = theme => ({
  chip: {
    margin: theme.spacing.unit / 2,
    padding: theme.spacing.unit
  },
});

const accountCreationStages = {
  pin: {
    key: 0,
    progressValue: 25,
    progressTitle: 'Step 1 of 4'
  },
  mnemonic: {
    key: 1,
    progressValue: 50,
    progressTitle: 'Step 2 of 4'
  },
  validation: {
    key: 2,
    progressValue: 75,
    progressTitle: 'Step 3 of 4'
  },
  completion: {
    key: 3,
    progressValue: 100,
    progressTitle: 'Step 4 of 4'
  }
}

class AccountCreation extends Component {

  constructor (props) {
    super()
    this.state = {
      currentStage: accountCreationStages.pin.key,
      showModal: false,
      pinValue1: '',
      pinValue2: '',
      mnemonicValue: '',
      passphraseValue1: '',
      passphraiseValue2: '',
      validationValue1: {},
      validationValue2: {},
      validationValue3: {},
      validationValue4: {},
      validationValue5: {},
      currentValidationStage: 1,
      validationPhrase: sampleWords,
      recoveryPhrase: sampleWords
    }
    this.handleChange = this.handleChange.bind(this)
    this.handlePINSubmit = this.handlePINSubmit.bind(this)
    this.handleWriteMnemonicSubmit = this.handleWriteMnemonicSubmit.bind(this)
    this.togglePassphraseModal = this.togglePassphraseModal.bind(this)
    this.handleNextValidationStep = this.handleNextValidationStep.bind(this)
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
      case accountCreationStages.pin.key:
        return (
          this.renderPINView()
        )
      break;
      case accountCreationStages.mnemonic.key:
        return (
          this.renderMnemonicView()
        )
      break;
      case accountCreationStages.validation.key:
        return (
          this.renderValidationView()
        )
      break;
    }
  }

  //region 1. PIN View
  renderPINView() {
    const {progressValue, progressTitle, valueInitial} = accountCreationStages.pin;
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
    const {progressValue, progressTitle} = accountCreationStages.mnemonic;
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
                avatar={
                  <Avatar style={{fontFamily: font, fontWeight:'300', fontSize:'0.75rem',
                  backgroundColor:'#EFF5F9', color:'#777777'}}>{data.key + 1}</Avatar>
                }
                label={`${data.label}`}
                className={materialStyles.chip}
                style={{fontFamily: font, fontWeight:'400', fontSize:'0.75rem', letterSpacing: '0.03rem',
                  marginLeft: '0.35rem', marginTop: '0.35rem', marginBottom: '0.35rem',
                  backgroundColor:'#FFFFFF', color:'#555555'}}
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

  async handleWriteMnemonicSubmit (event) {
    event.preventDefault()
    await this.pickRandomIndex()
    this.setState({
      currentStage: 2
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
    const {progressValue, progressTitle, valueInitial} = accountCreationStages.validation;
    return (
      <div id={styles.contentContainer}>
        { this.renderProgressView(progressValue, progressTitle)}
        <h4> {`Enter the ${this.state.currentValidationValue.numeric} word of the recovery phrase`} </h4>
        <form id='sendAssetForm' onSubmit={this.handleNextValidationStep}>
          <div className='form-group input-group input-group-lg'>
            <input type='text' minLength='6' style={{outline: 'none', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem', marginLeft: '6rem', marginRight: '6rem'}}
              className="form-control" placeholder='Enter recovery word' value={valueInitial} onChange={this.handleChange} required />
          </div>
          <button style={{padding: '0.5rem', paddingLeft: '3.5rem', paddingRight: '3.5rem'}} type="submit" className="btn btn-outline-dark">
            Next
          </button>
        </form>
      </div>
    )
  }

  handleNextValidationStep (event) {
    event.preventDefault()
    console.log('Next Called')
    if (this.state.currentValidationStage < 6) {
      console.log('Increment next stage')
      this.setState({
        currentValidationStage: this.state.currentValidationStage + 1
      })
      this.pickRandomIndex()
    } else {
      console.log('Validation stages done!')
    }
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

  //Random index picker
  pickRandomIndex() {
    if (this.state.currentValidationStage < 6) {
      var index = Math.floor(Math.random() * this.state.validationPhrase.length)
      var value = this.state.validationPhrase[index]
      var updatedArray = this.state.validationPhrase.filter( (i) => {
        return i != value
      })
      console.log(`Random Picker || Index: ${index}, Value: ${value.label},
        UpdatedArray: ${JSON.stringify(updatedArray)}, OriginalArray: ${JSON.stringify(this.state.recoveryPhrase)}`)
      this.setState({
        [`validationValue${this.state.currentValidationStage}`]: value,
        validationPhrase: updatedArray,
        currentValidationValue: value
        //currentValidationStage: this.state.currentValidationStage + 1 //After the user enters
      })
    }
  }
}

export default connect(null, null)(AccountCreation)