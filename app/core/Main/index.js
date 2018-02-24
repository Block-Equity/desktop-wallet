import React, { Component } from 'react'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'

import {
  initializeAccount,
  fetchAccountDetails
 } from '../../common/account/actions'

import { getAccounts, getCurrentAccount } from '../../common/account/selectors'

import { updateUserAccountToDB } from '../../db'
import isEmpty from 'lodash/isEmpty'
import QRCode from 'qrcode.react'

// import styles from './MainApp.css'
import walletIcon from './images/icnWallet.png'
import settingIcon from './images/icnSettings.png'

import { sendPayment, getAccountDetail, receivePaymentStream } from '../../services/networking/horizon'

import {
  MainContainer,
  NavigationContainer,
  // NavigationContainerSpacer,
  // NavigationSpacer,
  ContentContainer,
  HeaderThree,
  HeaderFive,
  SendAssetFormContainer
  // SendAssetFormLabel
} from './styledComponents'

const styles = {}

const NAV_ICON_SIZE = 30

class Main extends Component {
  constructor (props) {
    super()
    this.state = {
      currentAccount: undefined,
      currentAccountDetails: undefined,
      mainAccountAddress: '',
      mainAccountBalance: '',
      sendAddress: '',
      sendAmount: '',
      streamRegistered: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    console.log('nextProps', nextProps)

    if (!isEqual(this.props.currentAccount, nextProps.currentAccount)) {
      const { currentAccount } = nextProps
      fetchAccountDetails(currentAccount)

      // TODO:
      // - Cancel previous state stream when switching to another account
      // - Bind a `resolve` function that is triggered by the stream whenever a message
      //   is received
      receivePaymentStream(currentAccount.pKey)
    }

    if (!isEqual(this.props.currentAccountDetails, nextProps.currentAccountDetails)) {
      const { currentAccountDetails } = nextProps

      this.setState({
        currentAccountDetails
      })
    }
  }

  async componentDidMount () {
    try {
      this.props.initializeAccount()
    } catch (e) {
      // TODO: display something on the UI
      console.error('Unable to send payment', e)
    }
  }

  handleChange (event) {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }

  async handleSubmit (event) {
    event.preventDefault()

    if (!event.target.checkValidity()) {
      this.setState({
        invalid: true,
        displayErrors: true
      })
      return
    }

    console.log(`Valid Form Input || Account : ${this.state.sendAddress}`)
    console.log(`Valid Form Input || Amount : ${this.state.sendAmount}`)

    const { sKey, sequence } = this.props.accounts[this.props.currentWallet]

    const mainAccountAddress = this.state.mainAccountAddress

    try {
      // 1. Send the payment
      await sendPayment({
        publicKey: mainAccountAddress,
        secretKey: sKey,
        sequence,
        destinationId: this.state.sendAddress,
        amount: this.state.sendAmount
      })

      // 2. Set the state. Note: This will occur only when `sendPayment` above completes
      this.setState({
        sendAddress: '',
        sendAmount: '',
        displayErrors: false
      })

      // 3. Get the account details
      const { balance, sequence: nextSequence } = await getAccountDetail(mainAccountAddress)

      // 4. Update the user account (in the local DB) with the the details retrieved from above
      const accounts = await updateUserAccountToDB({
        publicKey: mainAccountAddress,
        secretKey: sKey,
        balance,
        sequence: nextSequence
      })

      this.props.setUserAccount(accounts)
    } catch (e) {
      // TODO: display something on the UI
      console.error('Unable to send payment', e)
    }
  }

  renderAccountInfoContent () {
    if (!isEmpty(this.props.currentWallet)) {
      this.state.mainAccountAddress = this.props.accounts[this.props.currentWallet].pKey
      this.state.mainAccountBalance = this.props.accounts[this.props.currentWallet].balance.balance
      return (
        <MainContainer>
          <HeaderThree>{this.state.mainAccountAddress}</HeaderThree>
          <HeaderFive>Balance: {this.state.mainAccountBalance}</HeaderFive>
          <QRCode value={this.state.mainAccountAddress} size={100} />
        </MainContainer>
      )
    }
  }

  renderSendMoneySection () {
    const { invalid, displayErrors } = this.state

    var formStyle = ''

    if (displayErrors) {
      formStyle = styles.sendAssetFormDisplayErrors
    }

    return (
      <SendAssetFormContainer>
        <form id='sendAssetForm' onSubmit={this.handleSubmit} noValidate className={formStyle}>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendAddress'>Send to address: </label>
            <input type='text' className='form-control' placeholder='Send Address'
              id='sendAddress' name='sendAddress' value={this.state.sendAddress} onChange={this.handleChange} required />
          </div>
          <div className='form-group'>
            <label className={styles.sendAssetFormLabel} htmlFor='sendAmount'>Amount in XLM: </label>
            <input type='text' className='form-control' placeholder='Amount in XLM'
              id='sendAmount' name='sendAmount' value={this.state.sendAmount} onChange={this.handleChange} required />
          </div>
          <button className='btn btn-outline-success' type='submit'>Save</button>
        </form>
      </SendAssetFormContainer>
    )
  }

  render () {
    return (
      <MainContainer>
        <NavigationContainer>
          <img src={walletIcon} alt='' width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
          <img src={settingIcon} className={styles.mainPageNavContainerSpacer} alt='' width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
        </NavigationContainer>
        <ContentContainer>
          { this.renderAccountInfoContent() }
          { this.renderSendMoneySection() }
        </ContentContainer>
      </MainContainer>
    )
  }
}

function mapStateToProps (state) {
  return {
    accounts: getAccounts(state),
    currentAccount: getCurrentAccount(state)
  }
}

export default connect(mapStateToProps, {
  initializeAccount
})(Main)
