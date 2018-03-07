import React, { Component } from 'react'
import { connect } from 'react-redux'

//Material Design
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Chip from 'material-ui/Chip';

import styles from './style.css'

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
      currentStage: INITIAL_ACCOUNT_CREATION_STAGE
    }
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
          //this.renderPINView()
          this.renderMnemonicView()
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

  renderPINView() {
    const {progressValue, progressTitle} = this.state.accountCreationStage.pin;
    return (
      <div style={{padding: '2rem'}}>
        { this.renderProgressView(progressValue, progressTitle)}
        <Typography style={{marginBottom: '0.75rem'}} variant='title' component='h2' align='center'> Create a <b>4 digit</b> PIN </Typography>
        <form id='sendAssetForm' onSubmit={this.handleSubmit}>
          <div className='form-group input-group input-group-lg'>
            <input type='text' style={{margin: '2rem'}} className="form-control" placeholder='Enter PIN e.g. 3194'
              id='sendAddress' name='sendAddress' value={this.state.sendAddress} onChange={this.handleChange} required />
          </div>
          <button style={{padding: '0.5rem', paddingLeft: '3.5rem', paddingRight: '3.5rem'}} type="submit" className="btn btn-outline-dark">
            Done
          </button>
        </form>
      </div>
    )
  }

  renderMnemonicView() {
    const {progressValue, progressTitle} = this.state.accountCreationStage.mnemonic;
    return (
      <div style={{padding: '2rem'}}>
        { this.renderProgressView(progressValue, progressTitle)}
        <Typography style={{marginBottom: '0.75rem'}} variant='title' component='h2' align='center'> RECOVERY PHRASE </Typography>
        <Typography component="p">
          The phrase is case sensitive. Please make sure you <b>write down and save your recovery phrase</b>. You will need this phrase to use and restore your wallet.
        </Typography>
        <div className={styles.chipContainer}>
          {sampleWords.map(data => {
            return (
              <Chip
                key={data.key}
                label={`${data.key + 1}. ${data.label}`}
                className={materialStyles.chip}
                style={{marginLeft: '0.35rem', marginTop: '0.35rem', marginBottom: '0.35rem', backgroundColor:'#0F547E', color:'#FFFFFF'}}
              />
            );
          })}
        </div>
        <button style={{padding: '0.5rem', paddingLeft: '2.5rem', paddingRight: '2.5rem'}} type="button" className="btn btn-outline-dark">
          Yes, I have written it down.
        </button>
      </div>
    )
  }

  renderValidationView() {

  }

  renderProgressView(value, label) {
    return (
      <div className="progress" style={{height: '35px', marginBottom: '2rem'}}>
        <div className="progress-bar bg-info" role="progressbar" style={{width: `${value}%`}}
          aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">{label}</div>
      </div>
    )
  }

}

/*const mapStateToProps = (state) => {
  return {
    accounts: getAccounts(state),
    currentAccount: getCurrentAccount(state),
    incomingPayment: getIncomingPayment(state),
    paymentTransactions: getPaymentTransactions(state)
  }
}*/

export default connect(null, null)(AccountCreation)