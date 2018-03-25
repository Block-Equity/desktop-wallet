import React, { Component } from 'react'
import { connect } from 'react-redux'

import { unlock } from '../../common/auth/actions'
import {
  initializeDB,
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

import History from '../History'
import Tabs from '../Tabs'
import Receive from '../Receive'
import Send from '../Send'
import Alert from '../Alert'
import * as alertTypes from '../Alert/types'

import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import numeral from 'numeral'

import walletIcon from './images/icnWallet.png'
import settingIcon from './images/icnSettings.png'
import logoIcon from '../Launch/logo-white.png'

import styles from './style.css';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

const navigation = { history: 0, send: 1, receive: 2 }
const INITIAL_NAVIGATION_INDEX = navigation.history;

class Main extends Component {

  constructor (props) {
    super()
    this.state = {
      paymentTransactions: [],
      selectedMenuItem: INITIAL_NAVIGATION_INDEX,
      snackBarOpen: false,
      publicKey: '',
      paymentSending: false,
      paymentFailed: false
    }
  }

  async componentDidMount () {
    try {
      await this.props.unlock()
      await this.props.initializeDB()
      const { accounts } = this.props
      if (!isEmpty(accounts)) {
        console.log(`Length of accounts || ${Object.keys(accounts).length}`)
        const size = Object.keys(accounts).length
        const currentAccount = accounts[Object.keys(accounts)[size-1]]
        const { pKey: publicKey, sKey: secretKey } = currentAccount
        this.setState({publicKey: currentAccount.pKey})
        await this.props.setCurrentAccount(currentAccount)
        await this.props.fetchAccountDetails()
        await this.props.fetchPaymentOperationList()
        await this.props.streamPayments()
        if (this.props.incomingPayment.from !== publicKey || this.props.incomingPayment.from !== undefined ) {
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

  render () {
    return (
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageContentContainer}>
          { !isEmpty(this.props.currentAccount) && this.renderAccountInfoContent() }
          <div style={{width: '50%'}}>
            <Tabs selectedItem={this.selectedItem}/>
          </div>
          <div className={styles.mainPageComponentContainer}>
            { this.renderContent() }
          </div>
          { this.renderSnackBar() }
        </div>
      </div>
    )
  }

  renderAccountInfoContent () {
    const balance = this.props.currentAccount.balance.balance
    return (
      <div className={styles.mainPageHeaderContainer}>
        <img className={styles.mainPageHeaderLogo} src={logoIcon} alt=''></img>
        <div className={styles.mainPageHeaderBalanceTitle}> YOUR CURRENT XLM BALANCE </div>
        <div className={styles.mainPageHeaderBalanceLabel}><b> {numeral(balance).format('0,0.00')} </b> </div>
      </div>
    )
  }

  //Tab Selection Callback from Tabs component
  selectedItem = (item) => {
    this.setState({
      selectedMenuItem: item
    })
  }

  //Send Payment Call back
  receiveSendPaymentInfo = (info) => {
    (async () => {
      var formattedAmount = numeral(info.amount).format('0.0000000')
      await this.props.sendPaymentToAddress({
        destination: info.destination,
        amount: formattedAmount
      })

      await this.props.fetchAccountDetails()
      await this.props.fetchPaymentOperationList()

      this.setState({
        sendAmount: '',
        sendAddress: '',
        snackBarOpen: true,
        selectedMenuItem: INITIAL_NAVIGATION_INDEX
      })
    })().catch(err => {
        console.error(err);
    })
  }

  renderSnackBar() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleSnackBarClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Payment Sent</span>}
          action={[
            <Button key="close" color="secondary" size="small"
              onClick={this.handleSnackBarClose}>
              CLOSE
            </Button>
          ]}
        />
      </div>
    )
  }

  handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackBarOpen: false });
  };

  renderContent() {
    console.log(`Render content || state: ${this.state.selectedMenuItem}`)
    switch(this.state.selectedMenuItem) {
      case navigation.history:
        return (
          <History paymentTransactions={this.props.paymentTransactions} pKey={this.state.publicKey} />
        )
      break
      case navigation.send:
        return (
          <div style={{width: '60%'}}>
            <Send receiveSendPaymentInfo={ this.receiveSendPaymentInfo } paymentSending={ this.props.paymentSending } />
          </div>
        )
      break
      case navigation.receive:
        return (
          <div style={{width: '80%'}}>
            <Receive currentAccount={ this.props.currentAccount } />
          </div>
        )
      break
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    accounts: getAccounts(state),
    currentAccount: getCurrentAccount(state),
    incomingPayment: getIncomingPayment(state),
    paymentTransactions: getPaymentTransactions(state),
    paymentSending: state.payment.isSending,
    paymentFailed: state.payment.paymentFailed
  }
}

export default connect(mapStateToProps, {
  unlock,
  initializeDB,
  createAccount,
  fetchAccountDetails,
  setCurrentAccount,
  sendPaymentToAddress,
  fetchPaymentOperationList,
  streamPayments
})(Main)