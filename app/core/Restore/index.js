import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

//Helpers
import * as accountCreation from '../../services/security/createAccount'
import * as mnemonic from '../../services/security/mnemonic'
import { setPassword } from '../../services/authentication/keychain'
import * as encryption from '../../services/security/encryption'

//Redux Actions/States/Reducers
import { setUserPIN } from '../../db'
import { unlock } from '../../common/auth/actions'
import {
  initializeDB,
  addWalletToDB,
  setCurrentAccount
} from '../../common/account/actions'

import {
  getAccounts
} from '../../common/account/selectors'

import {
  fundAccount
} from '../../services/networking/horizon'

//Styles & UI
import styles from './style.css'
import NavBar from '../NavBar'
import MaterialButton from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'
import { CircularProgress } from 'material-ui/Progress'
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input }
from 'reactstrap';

import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';

const materialStyles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit,
  },
  chip: {
    margin: theme.spacing.unit / 2,
    padding: theme.spacing.unit
  }
})

//Constants
const font = "'Lato', sans-serif";
const AUTO_HIDE_DURATION = 6000

const accountRestoreStages = {
  mnemonic: {
    key: 0,
    progressValue: 33,
    progressTitle: 'Step 1 of 3'
  },
  pin: {
    key: 1,
    progressValue: 66,
    progressTitle: 'Step 2 of 3'
  },
  completion: {
    key: 2,
    progressValue: 100,
    progressTitle: 'Step 3 of 3'
  }
}

class Restore extends Component {

  constructor (props) {
    super()

    this.state = {
      currentStage: accountRestoreStages.mnemonic.key,
      restorationComplete: false,
      alertOpen: false,
      mnemonicInput: '',
      mnemonicInputLength: 0,
      suggestions: [],
      pinValue1: '',
      pinValue: '',
      initialPINSet: false,
      pinValueTrialCount: 1,
      passphraseValue1: '',
      passphraseValue: '',
      initialPassphraseSet: false,
      passphraseSetSuccess: false,
      passphraseTrialCount: 1,
      showModal: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handlePINSubmit = this.handlePINSubmit.bind(this)
    this.togglePassphraseModal = this.togglePassphraseModal.bind(this)
    this.handlePassphraseSubmit = this.handlePassphraseSubmit.bind(this)
    this.handleResetPassphrase = this.handleResetPassphrase.bind(this)
  }

  componentDidMount () {
    this.mnemonicTextArea.focus();
  }

  render() {
    if (this.state.restorationComplete === true) {
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
      case accountRestoreStages.mnemonic.key:
        return (
          this.renderMnemonicView()
        )
      break;
      case accountRestoreStages.pin.key:
        return (
          this.renderPINView()
        )
      break;
      case accountRestoreStages.completion.key:
        return (
          this.renderCompletionView()
        )
      break;
    }
  }

  //region Mnemonic View
  renderMnemonicView() {
    var wordCountLabel = `Word Count: ${this.state.mnemonicInputLength}`
    var advancedSecurityLabel = this.state.passphraseSetSuccess ?
    'Your passphrase has been set.' : 'Advanced Security >'
    const {progressValue, progressTitle, valueInitial} = accountRestoreStages.mnemonic
    return (
      <div id={styles.contentContainer}>
        { this.renderProgressView(progressValue, progressTitle)}
        <h4> Enter your Mnemonic Phrase </h4>
        <h6>
          Mnemonic phrase will be used to derive your Stellar address.
        </h6>
        { this.renderSuggestionsView() }
        <div className={styles.formContainer}>
          <form id='sendAssetForm' onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <label htmlFor='mnemonic'>{ wordCountLabel }</label>
              <textarea style={{lineHeight:'1.75rem'}} rows="5" className='form-control' type='text'
                placeholder='e.g. smoke ocean cake chair bike water upon toast' id='mnemonic' name='mnemonicInput'
                value={this.state.mnemonicInput} onChange={this.handleChange}
                ref={(input) => { this.mnemonicTextArea = input }}  required />
            </div>
            <button style={{width: '15rem', marginTop:'0.5rem'}}
              className='btn btn-outline-dark' type='submit'>Recover Wallet</button>
          </form>
        </div>
        <div id={styles.passphraseContainer}>
          <a onClick={this.handleResetPassphrase}>{advancedSecurityLabel}</a>
          { this.renderPassphraseModal() }
        </div>
      </div>
    )
  }

  renderSuggestionsView() {
    var checkedSuggestions = this.state.suggestions===true ? [] : this.state.suggestions
    return (
      <div style={{position:'absolute', zIndex: '2', marginTop: '18.5rem'}}>
        {checkedSuggestions.map(data => {
          return (
            <Chip
              key={data}
              label={data}
              onClick={this.handleSelect(data)}
              className={materialStyles.chip}
              style={{fontFamily: font, fontWeight:'400', fontSize:'0.75rem', letterSpacing: '0.03rem',
                  marginLeft: '0.45rem', marginTop: '0.35rem', marginBottom: '0.35rem',
                  backgroundColor:'#EFF5F9', color:'#444444'}}
            />
          );
        })}
      </div>
    );
  }

  handleSelect = data => () => {
    const suggestions = [...this.state.suggestions];
    const mnemonicArray = this.state.mnemonicInput.split(' ')
    mnemonicArray[mnemonicArray.length - 1] = data
    var mnemonicString = mnemonicArray.join(' ') + ' '
    this.setState({
      suggestions: [],
      mnemonicInput: mnemonicString
    });
    this.mnemonicTextArea.focus();
  }

  //region Passphrase modal and workflow
  renderPassphraseModal () {
    var header = this.state.initialPassphraseSet ? 'Re-enter the passphrase' : 'Enter a passphrase'
    return (
      <Modal isOpen={this.state.showModal} toggle={this.togglePassphraseModal} className={this.props.className} centered={true}>
        <ModalHeader toggle={this.togglePassphraseModal}>{header}</ModalHeader>
        <ModalBody>
          <h6 className={styles.passphraseModalBody}>
            Passphrase along with mnemonic phrase will be used to derive your address.
          </h6>
          <Input type="password" name="passphraseValue" id="passphraseValue"
            value={this.state.passphraseValue} onChange={this.handleChange}
            placeholder="Enter passphrase" />
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

  //endregion

  //region PIN View
  renderPINView() {
    const {progressValue, progressTitle, valueInitial} = accountRestoreStages.pin
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
          currentStage: accountRestoreStages.completion.key,
          alertOpen: false
        })
        //Proceed them to loading view
        this.completionOperations()
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
            currentStage: accountRestoreStages.mnemonic.key
          })
        }

      }
    }
  }
  //endregion

  //region 4. Completion View
  renderCompletionView() {
    const {progressValue, progressTitle, valueInitial} = accountRestoreStages.completion
    var header = 'Hooray!'
    return (
      <div id={styles.contentContainer}>
        { this.renderProgressView(progressValue, progressTitle)}
        <h4> {header} </h4>
        <h6>
          Please wait. Secure account restoration in progress.
        </h6>
        <CircularProgress size={50} style={{ color: '#0F547E', marginTop: '2rem' }} thickness={3} />
      </div>
    )
  }
  //endregion

  //region Completion Operation
  async completionOperations() {
    await this.initializeDatabase()
    await this.addPinToKeyChain()
    await this.encryptSecretKey()
    await this.addWalletToDB()
  }

  //1. Add password to KeyChain
  async addPinToKeyChain() {
    await setUserPIN(this.state.pinValue)
  }

  //2. Initialize DB
  async initializeDatabase() {
    await this.props.unlock()
    await this.props.initializeDB()
  }

  //3. Encrypt Secret Key using PIN
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

  //5. Fund user account (Development Purposes only)
  async fundWallet() {
    await fundAccount(this.state.wallet.publicKey)
  }

  //4. Add user account
  async addWalletToDB() {
    const { wallet } = this.state
    console.log('EncryptedWallet', wallet)
    await this.props.addWalletToDB(wallet)
    this.setState({
      restorationComplete: true
    })
  }
  //endregion

  //region Form submission
  //Form submission
  handleSubmit(event) {
    event.preventDefault()
    const { valid, error } = mnemonic.validSeed(this.state.mnemonicInput)
    if (valid) {
      try {
        const phrase = this.state.mnemonicInput.trim() //important! spaces can lead to different key pairs
        const wallet = accountCreation.createWallet(phrase,
          this.state.passphraseValue, 0)
        console.log(`Wallet Keys: ${JSON.stringify(wallet)}`)
        this.setState({
          alertOpen: false,
          mnemonicInput: '',
          mnemonicInputLength: 0,
          wallet: wallet,
          currentStage: accountRestoreStages.pin.key
        })
      } catch(error) {
        this.showValidationErrorMessage('Incorrect Mnemonic Phrase. Please try again.')
        this.setState({
          mnemonicInputLength: 0
        })
      }
    } else {
      this.showValidationErrorMessage( 'Incorrect Mnemonic Phrase. Please try again.')
      this.setState({
        mnemonicInputLength: 0
      })
    }
  }

  handleChange(event) {
    event.preventDefault()
    const target = event.target
    const name = target.name
    var value = target.value
    if (name==='pinValue') {
      value = value.replace(/[^0-9]/g,'')
    }

    switch (this.state.currentStage) {
      case accountRestoreStages.mnemonic.key:
        var wordLength = value !== '' ? value.match(/\S+/g).length : 0
        const mnemonicArray = value.split(' ')
        const suggestions = mnemonic.suggest(mnemonicArray[mnemonicArray.length - 1])
        console.log(`Word Suggestions || ${JSON.stringify(suggestions)}`)
        this.setState({
          [name]: value,
          mnemonicInputLength: wordLength,
          suggestions: suggestions
        })
      break;
      case accountRestoreStages.pin.key:
        this.setState({
          [name]: value
        })
      break;
    }
  }
  //endregion

  renderProgressView(value, label) {
    return (
      <div className="progress" style={{height: '30px', marginBottom: '2rem', width: '80%'}}>
        <div className="progress-bar bg-info" role="progressbar" style={{width: `${value}%`}}
          aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">{label}</div>
      </div>
    )
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
              backgroundColor:'#962411',
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
})(Restore)