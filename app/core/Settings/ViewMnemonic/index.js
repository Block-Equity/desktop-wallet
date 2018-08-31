import React, { Component } from 'react'
import styles from './style.css'
import { getPhrase } from '../../../db'
import { getPIN } from '../../../db/pin'
import MnemonicView from '../../Shared/Mnemonic'
import ActionButton from '../../Shared/ActionButton'
import Alert from '../../Shared/Alert'
import { 
  get as getPinOptions, 
  GATE_VIEW_MNEMONIC, 
  SEQUENCE 
} from '../../../db/pin'

import { Form, FormGroup, Input } from 'reactstrap'

class ViewMnemonic extends Component {

  constructor (props) {
    super()
    this.state = {
      pinValue: '',
      retrieve: false,
      alertOpen: false,
      alertMessage: '',
      alertSuccess: true,
      title: 'Please enter your PIN to view your mnemonic phrase.',
      phrase: [],
      viewPhrase: false,
      expectPIN: true
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount() {
    const pinOptions = await getPinOptions()
    
    if(!pinOptions[GATE_VIEW_MNEMONIC]) {
      const phrase = await getPhrase(pinOptions[SEQUENCE])
      const mnemonicArray = phrase.phrase.split(' ')
      
      this.setState({
        title: 'For additional security, enable PIN entry to view mnemonic',
        phrase: mnemonicArray,
        viewPhrase: true,
        retrieve: false,
        pinValue: ''
      })
    }
  }

  render() {
    return (
      <div id={styles.formContainer}>
        <h6 style={{width: '28rem', marginLeft: '1rem'}}>
          { this.state.title }
        </h6>
        { this.renderContent() }
        <Alert
          open={this.state.alertOpen}
          message={this.state.alertMessage}
          success={this.state.alertSuccess}
          close={() => { this.setState({ alertOpen: false })}}
        />
      </div>
    )
  }

  renderContent () {
    const mnemonicView = ( <MnemonicView style={{marginLeft: '1rem', marginRight: '1rem'}} phrase={ this.state.phrase } /> )

    const btnTitle = {
      default: 'View Mnemonic Phrase',
      processing: 'Retrieving Mnemonic Phrase'
    }

    const pinView = (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Input type='password' placeholder='Your PIN' maxLength='4'
            id='pinValue' name='pinValue' value={this.state.pinValue} onChange={this.handleChange} required />
        </FormGroup>
        <ActionButton processing={ this.state.retrieve } title={ btnTitle } isForm={ true } />
      </Form>
    )
    if (this.state.viewPhrase) {
      return mnemonicView
    } else {
      return pinView
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    //Save the new PIN in DB and provide confirmation
    const resetPINValues = {
      pinValue: this.state.pinValue
    }

    console.log(`Reset PIN Values: ${JSON.stringify(resetPINValues)}`)
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
    const pin = await getPIN()
    console.log(`PIN Saved in DB: ${pin}`)
    if (pin === this.state.pinValue) {
      //TODO: Retrieve Menmonic Phrase
      const phrase = await getPhrase(this.state.pinValue)
      const mnemonicArray = phrase.phrase.split(' ')
      this.timer = setTimeout(() => {
        this.setState({
          title: 'Your mnemonic phrase will be displayed for 3 minutes',
          phrase: mnemonicArray,
          viewPhrase: true,
          retrieve: false,
          pinValue: ''
        })
      }, 1500)

      //After 3 minutes hide the mnemonic
      setTimeout(() => {
        this.setState({
          title: 'Please enter your PIN to view your mnemonic phrase.',
          phrase: '',
          viewPhrase: false,
        })
      }, 180000)

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

export default ViewMnemonic