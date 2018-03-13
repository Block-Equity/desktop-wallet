import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

//helpers
import * as accountCreation from '../../services/security/createAccount'
import * as mnemonic from '../../services/security/mnemonic'

//Styles & UI
import styles from './style.css'
import NavBar from '../NavBar'
import MaterialButton from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import { CircularProgress } from 'material-ui/Progress';

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
});

//Constants
const font = "'Lato', sans-serif";
const AUTO_HIDE_DURATION = 8000

class Restore extends Component {

  constructor (props) {
    super()
    this.state = {
      restorationComplete: false,
      alertOpen: false,
      mnemonicInput: '',
      passphraseInput: '',
      mnemonicInputLength: 0,
      suggestions: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  render() {
    if (this.state.accountCreationComplete === true) {
      return <Redirect to='/wallet' />
    }

    return (
      <div className={styles.container}>
        <NavBar/>
        <div style={{margin: '1rem', textAlign: 'center'}}>
        { this.renderContent() }
        </div>
        { this.renderAlertView() }
      </div>
    )
  }

  renderContent() {
    var wordCountLabel = `Word Count: ${this.state.mnemonicInputLength}`
    return (
      <div id={styles.contentContainer}>
      <h4> Enter your Mnemonic Phrase </h4>
      <h6>
        Mnemonic phrase will be used to derive your Stellar address.
      </h6>
      { this.renderSuggestionsView() }
      <div id={styles.formContainer}>
        <form id='sendAssetForm' onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='mnemonic'>{ wordCountLabel }</label>
            <textarea style={{lineHeight:'1.75rem'}} rows="5" className='form-control' type='text'
              placeholder='e.g. smoke ocean cake chair bike water upon toast' id='mnemonic' name='mnemonicInput'
              value={this.state.mnemonicInput} onChange={this.handleChange} required />
          </div>
          <button style={{width: '15rem', marginTop:'0.5rem'}}
            className='btn btn-outline-dark' type='submit'>Recover Wallet</button>
        </form>
      </div>
    </div>
    )
  }

  renderSuggestionsView() {
    var checkedSuggestions = this.state.suggestions===true ? [] : this.state.suggestions
    var conditionalStyling = checkedSuggestions.length === 0 ? {marginTop: '6rem', padding: '0.5rem'} : {marginTop: '6rem', padding: '0rem'}
    return (
      <div style={{position:'absolute', zIndex: '2', marginTop: '15rem'}}>
        {checkedSuggestions.map(data => {
          return (
            <Chip
              key={data}
              label={data}
              onClick={this.handleDelete(data)}
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

  handleDelete = data => () => {
    const suggestions = [...this.state.suggestions];
    const chipToDelete = suggestions.indexOf(data);
    suggestions.splice(chipToDelete, 1);
    this.setState({ suggestions });
  }

  handleSubmit(event) {
    event.preventDefault()
    console.log(`Submitted Mnemonic: ${this.state.mnemonicInput}`)
    const { valid, error } = mnemonic.validSeed(this.state.mnemonicInput)
    if (valid) {
      try {
        const wallet = accountCreation.createWallet(this.state.mnemonicInput,'', 0)
        console.log(`Wallet Keys: ${JSON.stringify(wallet)}`)
        this.setState({
          alertOpen: false,
          restorationComplete: true,
          mnemonicInput: '',
          mnemonicInputLength: 0
        })
      } catch(error) {
        this.setState({
          alertOpen: true,
          alertMessage: 'Incorrect Mnemonic Phrase. Please try again.',
          mnemonicInputLength: 0
        })
      }
    } else {
      this.setState({
        alertOpen: true,
        alertMessage: 'Incorrect Mnemonic Phrase. Please try again.',
        mnemonicInputLength: 0
      })
    }
  }

  handleChange(event) {
    event.preventDefault()

    const target = event.target
    const value = target.value
    const name = target.name
    var wordLength = value !== '' ? value.match(/\S+/g).length : 0
    const mnemonicArray = value.split(' ')
    const suggestions = mnemonic.suggest(mnemonicArray[mnemonicArray.length - 1])
    console.log(`Word Suggestions || ${JSON.stringify(suggestions)}`)
    this.setState({
      [name]: value,
      mnemonicInputLength: wordLength,
      suggestions: suggestions
    })
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

export default connect(null, null)(Restore)