import React, { Component } from 'react'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'

import { initializeAccount, fetchAccountDetails } from '../../common/account/actions'
import { getAccounts, getCurrentAccount } from '../../common/account/selectors'
import { sendPaymentToAddress } from '../../common/payment/actions'

import isEmpty from 'lodash/isEmpty'
import QRCode from 'qrcode.react'

import walletIcon from './images/icnWallet.png'
import settingIcon from './images/icnSettings.png'

// import { receivePaymentStream } from '../../services/networking/horizon'

import {
  MainContainer,
  NavigationContainer,

  ContentContainer,
  AccountAddressLabel,
  AccountBalanceLabel,
  SendAssetFormContainer,
  SendAssetFormLabel,
  WalletIcon,
  SettingsIcon
} from './styledComponents'

const styles = {}

class Main extends Component {
  constructor (props) {
    super()
    this.state = {
      currentAccount: undefined,
      currentAccountDetails: undefined,
      sendAddress: 'GACCYANIKFQPYJZ7VTWKR6DH3AWNOLO7ETVFBVWHLLZ62VPRIFNDZTJ2',
      sendAmount: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    console.log('nextProps', nextProps)

    if (!isEqual(this.props.currentAccount, nextProps.currentAccount)) {
      const { currentAccount } = nextProps
      this.props.fetchAccountDetails(currentAccount)

      // TODO:
      // - Cancel previous state stream when switching to another account
      // - Bind a `resolve` function that is triggered by the stream whenever a message
      //   is received
      // receivePaymentStream(currentAccount.pKey)
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

    // if (!event.target.checkValidity()) {
    //   this.setState({
    //     invalid: true,
    //     displayErrors: true
    //   })
    //   return
    // }

    console.log(`Valid Form Input || Account : ${this.state.sendAddress}`)
    console.log(`Valid Form Input || Amount : ${this.state.sendAmount}`)

    this.props.sendPaymentToAddress({
      destination: this.state.sendAddress,
      amount: this.state.sendAmount
    })
  }

  renderAccountInfoContent () {
    const address = this.props.currentAccount.pKey
    const balance = this.props.currentAccount.balance.balance

    return (
      <ContentContainer>
        <AccountAddressLabel>{address}</AccountAddressLabel>
        <AccountBalanceLabel>Balance: {balance}</AccountBalanceLabel>
        <QRCode value={address} size={100} />
      </ContentContainer>
    )
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
            <SendAssetFormLabel htmlFor='sendAddress'>Send to address: </SendAssetFormLabel>
            <input type='text' className='form-control' placeholder='Send Address'
              id='sendAddress' name='sendAddress' value={this.state.sendAddress} onChange={this.handleChange} required />
          </div>
          <div className='form-group'>
            <SendAssetFormLabel htmlFor='sendAmount'>Amount in XLM: </SendAssetFormLabel>
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
          <WalletIcon src={walletIcon} alt='' />
          <SettingsIcon src={settingIcon} alt='' />
        </NavigationContainer>
        <ContentContainer>
          { !isEmpty(this.props.currentAccount) && this.renderAccountInfoContent() }
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
  initializeAccount,
  fetchAccountDetails,
  sendPaymentToAddress
})(Main)
