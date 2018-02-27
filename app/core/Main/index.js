import React, { Component } from 'react'
import { connect } from 'react-redux'

import { unlock } from '../../common/auth/actions'
import {
  initializeAccount,
  createAccount,
  fetchAccountDetails,
  setCurrentAccount
} from '../../common/account/actions'

import {
  getAccounts,
  getCurrentAccount
} from '../../common/account/selectors'

import {
  sendPaymentToAddress,
  fetchPaymentOperationList,
  streamPayments
} from '../../common/payment/actions'

import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import QRCode from 'qrcode.react'

import walletIcon from './images/icnWallet.png'
import settingIcon from './images/icnSettings.png'

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

import * as horizon from '../../services/networking/horizon'

const styles = {}

class Main extends Component {
  constructor (props) {
    super()
    this.state = {
      // TODO: temporary here, cuz I'm tired of populating every time :p
      sendAddress: 'GACCYANIKFQPYJZ7VTWKR6DH3AWNOLO7ETVFBVWHLLZ62VPRIFNDZTJ2',
      sendAmount: '',
      paymentTransactions: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount () {
    try {
      // TODO: this is temporarily here. It will be moved to the Login (or auth flow) once
      // it's done
      await this.props.unlock()
      await this.props.initializeAccount()

      const { accounts } = this.props

      if (isEmpty(accounts)) {
        // TODO: friend bot is broken, so comment the two lines below, and use harcoded keypair
        // const { mnemonic, publicKey, secretKey } = horizon.createSeed()
        // await this.props.createAccount({ publicKey, secretKey })

        /// ///// DELETE WHEN IT'S BACK UP /////////
        const publicKey = 'GBW74UVOXKGHO3WX6AV5ZGTB4JYBKCEJOUQAUSI25NRO3PKY5BC7WYZS'
        const secretKey = 'SA3W53XXG64ITFFIYQSBIJDG26LMXYRIMEVMNQMFAQJOYCZACCYBA34L'
        const { balance, sequence } = await horizon.getAccountDetail(publicKey)

        await this.props.setCurrentAccount({ pKey: publicKey, sKey: secretKey, balance, sequence })
        await this.props.fetchAccountDetails()
        await this.props.fetchPaymentOperationList()
        await this.props.streamPayments()
        await this.props.fetchAccountDetails()
        /// ///// DELETE WHEN IT'S BACK UP /////////
      } else {
        const currentAccount = accounts[Object.keys(accounts)[0]]
        const { pKey: publicKey, sKey: secretKey } = currentAccount
        await this.props.setCurrentAccount(currentAccount)
        await this.props.fetchAccountDetails()
        //TODO: Fetching payment operation list will be component specific
        await this.props.fetchPaymentOperationList()
        await this.props.streamPayments() //TODO: Perhaps after streaming payments fetch account details within the same action?
        await this.props.fetchAccountDetails()
        await this.props.fetchPaymentOperationList()
        new Notification('Payment Received',
          { body: `You have received ${this.state.incomingPayment.amount} XLM from ${this.state.incomingPayment.from}`}
        )
      }
    } catch (e) {
      console.log(e)
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

    await this.props.sendPaymentToAddress({
      destination: this.state.sendAddress,
      amount: this.state.sendAmount
    })

    await this.props.fetchAccountDetails()
    await this.props.fetchPaymentOperationList()

    this.setState({
      sendAmount: ''
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
    // TODO: handle form errors
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
          <button className='btn btn-outline-success' type='submit'>Send</button>
        </form>
      </SendAssetFormContainer>
    )
  }

  //TODO: Create another component for this.
  renderTableHeaders() {
    const tableHeaders = [
      'Date', 'Account', 'Amount'
    ];
    return tableHeaders.map((item, index) => {
        return (
            <th scope="col" key={ index }>{ item }</th>
        )
    });
  }

  renderTableData() {
    return this.props.paymentTransactions.map((item, index) => {
      return (
          <tr key={ index }>
          <td>{ item.created_at }</td>
          <td>{ item.from }</td>
          <td>{ item.amount }</td>
          </tr>
      )
    });
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
          <table className="table table-hover table-dark">
            <thead className="thead-dark">
              <tr>
                { this.renderTableHeaders() }
              </tr>
            </thead>
            <tbody>
                { this.renderTableData() }
            </tbody>
          </table>
        </ContentContainer>
      </MainContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accounts: getAccounts(state),
    currentAccount: getCurrentAccount(state),
    incomingPaymentMessage: state.payment.incomingPaymentMessage,
    paymentTransactions: state.payment.paymentTransactions
  }
}

export default connect(mapStateToProps, {
  unlock,
  initializeAccount,
  createAccount,
  fetchAccountDetails,
  setCurrentAccount,
  sendPaymentToAddress,
  fetchPaymentOperationList,
  streamPayments
})(Main)
