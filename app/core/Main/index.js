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

import { joinInflationDestination } from '../../services/networking/horizon'

import History from '../History'
import Tabs from '../Tabs'
import Receive from '../Receive'
import Send from '../Send'
import Settings from '../Settings'
import Alert from '../Alert'
import * as alertTypes from '../Alert/types'

import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import numeral from 'numeral'

import walletIcon from './images/icnWallet.png'
import settingIcon from './images/icnSettings.png'
import logoIcon from '../Launch/logo-white.png'

import styles from './style.css'

import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'
import Drawer from 'material-ui/Drawer'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import ListSubheader from 'material-ui/List/ListSubheader'
import Divider from 'material-ui/Divider'
import { Card, Col } from 'reactstrap'

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
      userAccountDetailFailed: false,
      settingsOpen: false
    }
    this.toggleSettingsDrawer = this.toggleSettingsDrawer.bind(this)
    this.joinInflationPool = this.joinInflationPool.bind(this)
  }

  async componentWillUpdate(nextProps) {
    if (nextProps.userAccountDetailFailed !== this.props.userAccountDetailFailed) {
      if (nextProps.userAccountDetailFailed) {
        var self = this;
        this.pollUserAccount = setInterval(function() {
          self.props.fetchAccountDetails()
        }, 7000);
      } else {
        clearInterval(this.pollUserAccount)
        await this.props.fetchPaymentOperationList()
      }
    }
  }

  render () {
    return (
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageContentContainer}>
          { !isEmpty(this.props.currentAccount) && this.renderAccountInfoContent() }
          <div style={{width: '100%'}}>
            <Tabs selectedItem={this.selectedItem} setItem={this.state.selectedMenuItem}/>
          </div>
          <div className={styles.mainPageComponentContainer}>
            { this.renderContent() }
          </div>
          { this.renderSnackBar() }
          <Settings setOpen={this.toggleSettingsDrawer(!this.state.settingsOpen)} open={this.state.settingsOpen}/>
        </div>
      </div>
    )
  }

  renderAccountInfoContent () {
    const { currentAccount } = this.props
    const balance = currentAccount.balance
    const assetDesc = `${currentAccount.asset_name} (${currentAccount.asset_code})`

    return (
      <Col sm='8'>
        <Card body
              style={{ backgroundColor: '#F9F9F9', borderColor: '#ECEEEF', marginBottom: '1rem', marginTop: '0.75rem'}}>
          <div className={styles.mainPageHeaderContainer}>
            <div className={styles.mainPageHeaderBalanceTitle}>
              { assetDesc }
            </div>
            <div className={styles.mainPageHeaderBalanceLabel}>
              <b> {numeral(balance).format('0,0.00')} </b>
            </div>
            { currentAccount.asset_type === 'native' &&
              <a onClick={this.joinInflationPool(currentAccount.pKey)} className='badge badge-success'
              style={{padding: '0.55rem', fontWeight: '300', marginTop: '0.5rem', color: '#FFFFFF'}}>Join Inflation Pool</a>}
          </div>
        </Card>
      </Col>
    )
  }

  joinInflationPool = ( publicKey ) => event => {

    (async() => {
      const { payload, error } = await joinInflationDestination(publicKey)
    })
  }

  toggleSettingsDrawer = (open) => () => {
    this.setState({
      settingsOpen: open
    })
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
      memoID: info.memoId
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
              fontSize:'0.9rem',
              paddingLeft: '13rem'
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
          <div style={{width: '60%'}}>
            <Send receiveSendPaymentInfo={ this.receiveSendPaymentInfo } paymentSending={ this.props.paymentSending } currentAddress={ this.state.publicKey } />
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
    paymentFailed: state.payment.paymentFailed,
    userAccountDetailFailed: state.account.fetchingFailed
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