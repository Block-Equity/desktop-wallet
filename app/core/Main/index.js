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

import {
  getIncomingPayment,
  getPaymentTransactions
} from '../../common/payment/selectors'

import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import QRCode from 'qrcode.react'

import walletIcon from './images/icnWallet.png'
import settingIcon from './images/icnSettings.png'
import logoIcon from '../Launch/logo-gray.png'

import {
  MainContainer,
  NavigationContainer,
  ContentContainer,
  AccountAddressLabel,
  AccountBalanceLabel,
  SendAssetFormContainer,
  SendAssetFormLabel,
  WalletIcon,
  SettingsIcon,
  LogoIcon
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

      if (!isEmpty(accounts)) {
        const currentAccount = accounts[Object.keys(accounts)[0]]
        const { pKey: publicKey, sKey: secretKey } = currentAccount
        await this.props.setCurrentAccount(currentAccount)
        await this.props.fetchAccountDetails()
        //TODO: Fetching payment operation list will be component specific
        await this.props.fetchPaymentOperationList()
        await this.props.streamPayments()
        if (this.props.incomingPayment.from !== publicKey) {
          new Notification('Payment Received',
            { body: `You have received ${this.props.incomingPayment.amount} XLM from ${this.props.incomingPayment.from}`}
          )
        }
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

    /*if (!event.target.checkValidity()) {
       this.setState({
         invalid: true,
         displayErrors: true
       })
       return
    }*/

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

  renderNavigationContainer() {
    return (
      <NavigationContainer>
        <WalletIcon src={walletIcon} alt='' />
        <SettingsIcon src={settingIcon} alt='' />
      </NavigationContainer>
    )
  }

  renderAccountInfoContent () {
    const address = this.props.currentAccount.pKey
    const balance = this.props.currentAccount.balance.balance

    return (
      <ContentContainer>
        <AccountBalanceLabel>Your Balance:
          <b> {balance} </b> </AccountBalanceLabel>
        <AccountAddressLabel>{address}</AccountAddressLabel>
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
        <ContentContainer>
          <LogoIcon src={logoIcon} alt=''></LogoIcon>
          { !isEmpty(this.props.currentAccount) && this.renderAccountInfoContent() }
          { this.renderSendMoneySection() }
          <table className="table-hover table-dark">
            <thead className="thead-light">
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
    incomingPayment: getIncomingPayment(state),
    paymentTransactions: getPaymentTransactions (state)
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
