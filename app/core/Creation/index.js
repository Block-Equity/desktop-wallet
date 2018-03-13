import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import keytar from 'keytar'
import isEmpty from 'lodash/isEmpty'

//Account Creation Dependencies
import * as accountCreation from '../../services/security/createAccount'
import * as encryption from '../../services/security/encryption'
import { unlock } from '../../common/auth/actions'
import {
  initializeDB,
  addWalletToDB,
  fundAccount,
  setCurrentAccount
} from '../../common/account/actions'

import {
  getAccounts
} from '../../common/account/selectors'

//Material Design
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import MaterialButton from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import { CircularProgress } from 'material-ui/Progress';

import NavBar from '../NavBar'
import styles from './style.css'
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input }
from 'reactstrap';

const AUTO_HIDE_DURATION = 8000

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
      pinValue: '',
      initialPINSet: false,
      pinValueTrialCount: 1,
      mnemonicValue: '',
      passphraseValue1: '',
      passphraseValue: '',
      initialPassphraseSet: false,
      passphraseSetSuccess: false,
      passphraseTrialCount: 1,
      validationValue: {},
      userEnteredValidation: '',
      currentValidationStage: 1,
      validationTrialCount: 1,
      alertOpen: false,
      alertMessage: '',
      validationPhrase: [],
      recoveryPhrase: [],
      accountCreationComplete: false,
      mnemonicString: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handlePINSubmit = this.handlePINSubmit.bind(this)
    this.handleWriteMnemonicSubmit = this.handleWriteMnemonicSubmit.bind(this)
    this.togglePassphraseModal = this.togglePassphraseModal.bind(this)
    this.handleNextValidationStep = this.handleNextValidationStep.bind(this)
    this.handlePassphraseSubmit = this.handlePassphraseSubmit.bind(this)
    this.handleResetPassphrase = this.handleResetPassphrase.bind(this)
  }

  componentDidMount () {
    this.generateMnemonic()
  }

  generateMnemonic() {
    const {mnemonic, mnemonicModel} = accountCreation.getMnemonic()
    console.log('Mnemonic', mnemonic)
    this.setState({
      validationPhrase: mnemonicModel,
      recoveryPhrase: mnemonicModel,
      mnemonicString: mnemonic
    })
  }

  render() {
    if (this.state.accountCreationComplete === true) {
      return <Redirect to='/wallet' />
    }

    return (
      <div className={styles.container}>
        <NavBar/>
        <div style={{margin: '1rem', textAlign: 'center'}}>
          { this.renderContent(this.state.currentStage) }
        </div>
        { this.renderAlertView() }
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
      case accountCreationStages.completion.key:
        return (
          this.renderCompletionView()
        )
      break;
    }
  }

  //region 1. PIN View
  renderPINView() {
    const {progressValue, progressTitle, valueInitial} = accountCreationStages.pin
    var header = this.state.initialPINSet ? 'Re-enter your 4 digit PIN' : 'Create a 4 digit PIN'
    return (
      <div id={styles.contentContainer}>
        { this.renderProgressView(progressValue, progressTitle)}
        <h4> {header} </h4>
        <h6>
          PIN will used to encrypt your secret keys. Please make sure you choose a PIN that is difficult to guess for others.
        </h6>
        <form id='setPINForm' onSubmit={this.handlePINSubmit}>
          <div className='form-group input-group input-group-lg'>
            <input type='password' maxLength='4' style={{outline: 'none', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem', marginLeft: '6rem', marginRight: '6rem'}} className="form-control" placeholder='Enter PIN e.g. 3194'
              id='userEnteredPinValue' name='pinValue' value={this.state.pinValue} onChange={this.handleChange} required />
          </div>
          <button style={{padding: '0.5rem', paddingLeft: '3.5rem', paddingRight: '3.5rem'}} type="submit" className="btn btn-outline-dark">
            Done
          </button>
        </form>
      </div>
    )
  }

  handlePINSubmit (event) {
    event.preventDefault()

    if (!this.state.initialPINSet) {
      //Store pinValue 1
      this.setState({
        pinValue1: this.state.pinValue,
        pinValue: '',
        initialPINSet: true
      })
    } else {
      //Validate PIN Value
      if (this.state.pinValue1 === this.state.pinValue) {
        this.setState({
          currentStage: 1,
          alertOpen: false
        })
      } else {
        //Show user message that it's not the same
        var errorMessage
        var count = 3 - this.state.pinValueTrialCount
        if (count === 2) {
          errorMessage = 'PIN doesn\'t match. You have 2 more tries left.'
        } else if (count === 1) {
          errorMessage = 'PIN doesn\'t match. You have 1 more try left.'
        } else {
          errorMessage = `PIN word doesn't match. Starting account creation process from beginning.`
        }

        this.showValidationErrorMessage(errorMessage)

        if (this.state.pinValueTrialCount >= 1 && this.state.pinValueTrialCount <=2 ) {
          console.log(`Clear Validation Value and carry on ${this.state.pinValueTrialCount}`)
          this.setState({
            pinValue: '',
            pinValueTrialCount: this.state.pinValueTrialCount + 1
          })
        } else {
          console.log(`Maximum tries achieved. Start over. ${this.state.pinValueTrialCount}`)
          this.setState({
            pinValue: '',
            pinValue1: '',
            pinValueTrialCount: 1,
            initialPINSet: false,
            currentStage: 0
          })
        }

      }
    }
  }
  //endregion

  //region 2. Mnemonic View
  renderMnemonicView() {
    const {progressValue, progressTitle} = accountCreationStages.mnemonic;
    var advancedSecurityLabel = this.state.passphraseSetSuccess ?
      'Your passphrase has been set.' : 'Advanced Security >'
    return (
      <div id={styles.contentContainer}>
        { this.renderProgressView(progressValue, progressTitle)}
        <h4> Recovery Phrase </h4>
        <h6>
          The phrase is case sensitive. Please make sure you <b>write down and save your recovery phrase</b>. You will need this phrase to use and restore your wallet.
        </h6>
        <div className={styles.chipContainer}>
          {this.state.recoveryPhrase.map(data => {
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
          <a onClick={this.handleResetPassphrase}>{advancedSecurityLabel}</a>
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
    var header = this.state.initialPassphraseSet ? 'Re-enter the passphrase' : 'Enter a passphrase'
    return (
      <Modal isOpen={this.state.showModal} toggle={this.togglePassphraseModal} className={this.props.className} centered={true}>
        <ModalHeader toggle={this.togglePassphraseModal}>{header}</ModalHeader>
        <ModalBody>
          <Input type="password" name="passphraseValue" id="passphraseValue"
            value={this.state.passphraseValue} onChange={this.handleChange} placeholder="Enter passphrase" />
        </ModalBody>
        <ModalFooter>
          <Button outline color="dark" onClick={this.handlePassphraseSubmit}>Submit</Button>
        </ModalFooter>
      </Modal>
    )
  }

  togglePassphraseModal(event) {
    event.preventDefault()
    this.setState({
      showModal: !this.state.showModal
    });
  }

  handlePassphraseSubmit (event) {
    event.preventDefault()

    if (!this.state.initialPassphraseSet) {
      //Store passphrase value 1
      this.setState({
        passphraseValue1: this.state.passphraseValue,
        passphraseValue: '',
        initialPassphraseSet: true
      })
    } else {
      //Validate Passphrase Value
      if (this.state.passphraseValue1 === this.state.passphraseValue) {
        this.setState({
          showModal: false,
          passphraseSetSuccess: true,
          alertOpen: false
        })
      } else {
        //Show user message that it's not the same
        var errorMessage
        var count = 3 - this.state.passphraseTrialCount
        if (count === 2) {
          errorMessage = 'Passphrase doesn\'t match. You have 2 more tries left.'
        } else if (count === 1) {
          errorMessage = 'Passphrase doesn\'t match. You have 1 more try left.'
        } else {
          errorMessage = `Passphrase word doesn't match. Please choose a new passphrase.`
        }

        this.showValidationErrorMessage(errorMessage)

        if (this.state.passphraseTrialCount >= 1 && this.state.passphraseTrialCount <=2 ) {
          console.log(`Clear Validation Value and carry on ${this.state.passphraseTrialCount}`)
          this.setState({
            passphraseValue: '',
            passphraseTrialCount: this.state.passphraseTrialCount + 1
          })
        } else {
          console.log(`Maximum tries achieved. Start over. ${this.state.passphraseTrialCount}`)
          this.setState({
            passphraseValue: '',
            passphraseValue1: '',
            passphraseTrialCount: 1,
            initialPassphraseSet: false,
            passphraseSetSuccess: false
          })
        }

      }
    }
  }

  handleResetPassphrase(event) {
    event.preventDefault()
    this.setState({
      showModal: true,
      passphraseValue: '',
      passphraseValue1: '',
      passphraseTrialCount: 1,
      initialPassphraseSet: false,
      passphraseSetSuccess: false,
    })
  }

  //endregion

  //region 3. Validation View
  renderValidationView() {
    const {progressValue, progressTitle, valueInitial} = accountCreationStages.validation;
    return (
      <div id={styles.contentContainer}>
        { this.renderProgressView(progressValue, progressTitle)}
        <h5> {`Enter the ${this.state.currentValidationValue.numeric} word of the recovery phrase`} </h5>
        <form id='validationForm' onSubmit={this.handleNextValidationStep}>
          <div className='form-group input-group input-group-lg'>
            <input type='text' style={{outline: 'none', textAlign: 'center', marginTop: '1rem', marginBottom: '1rem', marginLeft: '6rem', marginRight: '6rem'}}
              name='userEnteredValidation' className="form-control" placeholder='Enter recovery word'
              value={this.state.userEnteredValidation} onChange={this.handleChange} required />
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
    var value = this.state.userEnteredValidation
    console.log(`Event Value: ${value}`)
    if (this.state.currentValidationStage < 5) {
      if (value === this.state.validationValue.label) {
        console.log('Increment next stage')
        this.setState({
          currentValidationStage: this.state.currentValidationStage + 1,
          userEnteredValidation: '',
          validationTrialCount: 1,
          validationValue: {},
          alertOpen: false
        })
        this.pickRandomIndex()
      } else {
        //Inform User
        var errorMessage
        var count = 3 - this.state.validationTrialCount
        if (count === 2) {
          errorMessage = 'Passphrase word doesn\'t match. You have 2 more tries left.'
        } else if (count === 1) {
          errorMessage = 'Passphrase word doesn\'t match. You have 1 more try left.'
        } else {
          errorMessage = `Passphrase word doesn't match. Starting account creation process from beginning.`
        }

        this.showValidationErrorMessage(errorMessage)

        if (this.state.validationTrialCount >= 1 && this.state.validationTrialCount <=2 ) {
          console.log(`Clear Validation Value and carry on ${this.state.validationTrialCount}`)
          this.setState({
            userEnteredValidation: '',
            validationTrialCount: this.state.validationTrialCount + 1
          })
        } else {
          console.log(`Maximum tries achieved. Start over. ${this.state.validationTrialCount}`)
          this.setState({
            userEnteredValidation: '',
            currentStage: accountCreationStages.pin.key,
            pinValue: '',
            pinValue1: '',
            pinValueTrialCount: 1,
            initialPINSet: false
          })
        }
      }
    } else {
      console.log('Validation stages done!')
      this.setState({
        userEnteredValidation: '',
        alertOpen: false,
        currentStage: accountCreationStages.completion.key
      })
      //Proceed them to loading view
      this.completionOperations()
    }
  }
  //endregion

  //region 4. Completion View
  renderCompletionView() {
    const {progressValue, progressTitle, valueInitial} = accountCreationStages.completion
    var header = 'Hooray!'
    return (
      <div id={styles.contentContainer}>
        { this.renderProgressView(progressValue, progressTitle)}
        <h4> {header} </h4>
        <h6>
          Please wait. Secure account creation in progress.
        </h6>
        <CircularProgress size={50} style={{ color: '#0F547E', marginTop: '2rem' }} thickness={3} />
      </div>
    )
  }
  //endregion

  //region Completion Operations
  async completionOperations() {
    await this.addPinToKeyChain()
    await this.initializeDatabase()
    await this.generateStellarWallet()
    await this.encryptSecretKey()
    await this.addWalletToDB()
  }

  //1. Add password to KeyChain
  addPinToKeyChain() {
    keytar.setPassword('BlockEQ', 'PIN', this.state.pinValue)
  }

  //2. Initialize DB
  async initializeDatabase() {
    await this.props.unlock()
    await this.props.initializeDB()
  }

  //3. Generate Stellar Wallet
  generateStellarWallet() {
    const { mnemonicString, passphraseValue } = this.state
    const wallet = accountCreation.createWallet(mnemonicString, passphraseValue, 0)
    this.setState({
      wallet: wallet
    })
  }

  //6. Encrypt Secret Key using PIN
  encryptSecretKey() {
    const { wallet, pinValue } = this.state
    var encryptedWallet = {}
    const secretKey = wallet.secretKey
    const encrypted = encryption.encryptText(secretKey, pinValue)
    encryptedWallet.secretKey = encrypted
    encryptedWallet.publicKey = wallet.publicKey
    encryptedWallet.balance = 0
    encryptedWallet.sequence = 0
    this.setState({
      wallet: encryptedWallet
    })
  }

  //7. Add user account
  async addWalletToDB() {
    const { wallet } = this.state
    console.log('EncryptedWallet', wallet)
    await this.props.addWalletToDB(wallet)
    this.setState({
      accountCreationComplete: true
    })
  }

  //5. Fund user account (Development Purposes only)
  fundWallet() {

  }
  //endregion

  //Re-usable components - TODO - put them in their own class....but for now this will do.
  renderProgressView(value, label) {
    return (
      <div className="progress" style={{height: '30px', marginBottom: '2rem'}}>
        <div className="progress-bar bg-info" role="progressbar" style={{width: `${value}%`}}
          aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">{label}</div>
      </div>
    )
  }

  handleChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name
    console.log(`Text Change || ${value}`)
    console.log(`Validation Value || ${this.state.validationValue.label}`)
    this.setState({
      [name]: value
    })
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
        UpdatedArray: ${JSON.stringify(updatedArray)}}`)
      this.setState({
        validationValue: value,
        validationPhrase: updatedArray,
        currentValidationValue: value
      })
    }
  }

  //region Alert View
  //Alert View
  renderAlertView() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.alertOpen}
          autoHideDuration={AUTO_HIDE_DURATION}
          onClose={this.handleSnackBarClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
            style: { fontFamily: font,
              fontWeight:'400',
              fontSize:'1rem',
              backgroundColor:'#4E6068',
              color:'#FFFFFF'
            },
          }}
          message={<span id="message-id">{this.state.alertMessage}</span>}
          action={[
            <MaterialButton key="close" color="default" size="small" onClick={this.handleSnackBarClose} style={{fontFamily: font, fontWeight:'700', color: '#FFFFFF'}}>
              CLOSE
            </MaterialButton>
          ]}
        />
      </div>
    )
  }

  handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ alertOpen: false });
  }

  showValidationErrorMessage(message) {
    this.setState({
      alertOpen: true,
      alertMessage: message
    })
  }
  //endregion
}

const mapStateToProps = (state) => {
  return {
    accounts: getAccounts(state)
  }
}

export default connect(mapStateToProps, {
  unlock,
  initializeDB,
  addWalletToDB,
  fundAccount,
  setCurrentAccount
})(AccountCreation)