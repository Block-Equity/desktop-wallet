import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
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

import { getExchangeDirectory } from '../../common/lists/selectors'

import AccountInfo from './AccountInfo'
import History from './History'
import Tabs from './Tabs'
import Receive from './Receive'
import Send from './Send'

import isEmpty from 'lodash/isEmpty'
import numeral from 'numeral'

import styles from './style.css'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'

const navigation = { history: 0, send: 1, receive: 2 }
const INITIAL_NAVIGATION_INDEX = navigation.history
const font = "'Lato', sans-serif"

class Main extends Component {

  constructor (props) {
    super()
    this.state = {
      paymentTransactions: [],
      selectedMenuItem: INITIAL_NAVIGATION_INDEX,
      snackBarOpen: false,
      snackBarMessage: '',
      publicKey: '',
      paymentSending: false,
      paymentFailed: false,
      userAccountDetailFailed: false
    }
  }

  async componentWillUpdate(nextProps) {
    if (nextProps.userAccountDetailFailed !== this.props.userAccountDetailFailed) {
      if (nextProps.userAccountDetailFailed) {
        var self = this;
        this.pollUserAccount = setInterval( function() {
          self.props.fetchAccountDetails()
        }, 7000);
      } else {
        this.props.streamPayments()
        clearInterval(this.pollUserAccount)
      }
    }
  }

  render () {
    return (
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageContentContainer}>
          { !isEmpty(this.props.currentAccount) && <AccountInfo /> }
          <div style={{width: '40rem'}}>
            <Tabs selectedItem={this.selectedItem} setItem={this.state.selectedMenuItem}/>
          </div>
          <div className={styles.mainPageComponentContainer}>
            { this.renderContent() }
          </div>
          { this.renderSnackBar() }
        </div>
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
    this.sendPaymentOp(info)
  }

  async sendPaymentOp (info) {
    var formattedAmount = numeral(info.amount).format('0.0000000')
    await this.props.sendPaymentToAddress({
      destination: info.destination,
      amount: formattedAmount,
      memoValue: info.memoValue
    })
    const msg = this.props.paymentFailed ? 'Payment Failed' : 'Payment Successful'
    console.log(`Send Payment Message: ${msg}`)

    this.setState({
      selectedMenuItem: INITIAL_NAVIGATION_INDEX,
      sendAmount: '',
      sendAddress: '',
      snackBarMessage: msg,
      paymentFailed: this.props.paymentFailed,
      snackBarOpen: true
    })
  }

  renderSnackBar() {
    return (
      <div style={{zIndex: '3'}}>
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
            style: { fontFamily: font,
              fontWeight:'400',
              fontSize:'0.9rem'
            },
          }}
          message={<span id="message-id">{this.state.snackBarMessage}</span>}
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
  }

  renderContent() {
    console.log(`Render content || state: ${this.state.selectedMenuItem}`)
    switch(this.state.selectedMenuItem) {
      case navigation.history:
        return (
          <History paymentTransactions={this.props.paymentTransactions} pKey={this.state.publicKey} currentAccount={this.props.currentAccount} />
        )
      break
      case navigation.send:
        return (
          <Send
            receiveSendPaymentInfo={ this.receiveSendPaymentInfo }
            paymentSending={ this.props.paymentSending }
            currentAccount={ this.props.currentAccount }
            exchangeList={ this.props.exchangeList } />
        )
      break
      case navigation.receive:
        return (
          <Receive currentAccount={ this.props.currentAccount } />
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
    paymentFailed: state.payment.paymentFailed,
    userAccountDetailFailed: state.account.fetchingFailed,
    exchangeList: getExchangeDirectory(state)
  }
}

export default connect(mapStateToProps, {
  createAccount,
  fetchAccountDetails,
  setCurrentAccount,
  sendPaymentToAddress,
  fetchPaymentOperationList,
  streamPayments
})(Main)