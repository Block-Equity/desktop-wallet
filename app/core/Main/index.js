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
import numeral from 'numeral'
import QRCode from 'qrcode.react'
import moment from 'moment'

import walletIcon from './images/icnWallet.png'
import settingIcon from './images/icnSettings.png'
import logoIcon from '../Launch/logo-gray.png'

import styles from './style.css';

import {
  MainContainer,
  NavigationContainer,
  ContentContainer,
  TabContainer,
  AccountInfoContainer,
  AccountInfoTitle,
  AccountBalanceContainer,
  AccountAddressLabel,
  AccountBalanceLabel,
  AccountBalanceCurrencyLabel,
  SendAssetFormContainer,
  SendAssetFormLabel,
  SendAssetInput,
  ReceiveAssetContainer,
  WalletIcon,
  SettingsIcon,
  LogoIcon
} from './styledComponents'

import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

const materialStyles = theme => ({
  root: {
    width: '80%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 600,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

import * as horizon from '../../services/networking/horizon'

const navigation = ['TRANSACTIONS', 'SEND', 'RECEIVE']
const INITIAL_NAVIGATION_INDEX = 'TRANSACTIONS';

class Main extends Component {

  constructor (props) {
    super()
    this.state = {
      // TODO: temporary here, cuz I'm tired of populating every time :p
      sendAddress: 'GANRFALPK2ZPRMD6G55QKSM25AN57J76JUHUNPZBFY3JRN6EMAPNSMYG',
      sendAmount: '',
      paymentTransactions: [],
      selectedMenuItem: INITIAL_NAVIGATION_INDEX,
      snackBarOpen: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.navigationClickHandler = this.navigationClickHandler.bind(this)
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

  renderAccountInfoContent () {
    const balance = this.props.currentAccount.balance.balance
    return (
      <div className={styles.mainPageHeaderContainer} block>
        <img className={styles.mainPageHeaderLogo} src={logoIcon} alt=''></img>
        <div className={styles.mainPageHeaderBalanceTitle}> YOUR CURRENT XLM BALANCE </div>
        <div className={styles.mainPageHeaderBalanceLabel}><b> {numeral(balance).format('0,0.00')} </b> </div>
      </div>
    )
  }

  //region Tabs
  renderTabs() {
    return (
      <TabContainer>
        <ul className="nav nav-pills nav-justified" id="pills-tab" role="tablist">
          { this.renderNavigationItems() }
        </ul>
      </TabContainer>
    )
  }

  renderNavigationItems() {
    return navigation.map((item, index) => {
        var idBuilder = `${item}-tab`;
        var classNameBuilder = (this.state.selectedMenuItem === item) ? 'nav-link active' : 'nav-link';
        return (
          <li className="nav-item" key={ idBuilder }>
              <a className={ classNameBuilder } href=''
                  onClick={(e) => this.navigationClickHandler(e, item)}>{ item }</a>
          </li>
        )
    });
  }

  navigationClickHandler(event, item) {
    event.preventDefault();
    this.setState({
      selectedMenuItem: item
    })
  }
  //endregion

  //region Receive Money
  renderReceiveMoneySection() {
    const address = this.props.currentAccount.pKey
    return (
      <div className={styles.receiveContainer}>
        <AccountAddressLabel>{address}</AccountAddressLabel>
        <QRCode value={address} size={100} />
      </div>
    )
  }
  //endregion

  //region Send Money
  renderSendMoneySection () {
    // TODO: handle form errors
    const { invalid, displayErrors } = this.state

    var formStyle = ''

    if (displayErrors) {
      formStyle = styles.sendAssetFormDisplayErrors
    }

    return (
      <SendAssetFormContainer>
        <form id='sendAssetForm' onSubmit={this.handleSubmit}>
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
      sendAmount: '',
      snackBarOpen: true,
      selectedMenuItem: INITIAL_NAVIGATION_INDEX
    })
  }

  handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackBarOpen: false });
  };

  async refreshList() {
    await this.props.fetchPaymentOperationList()
    this.setState({ snackBarOpen: false });
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
          onClose={this.handleClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Payment Sent</span>}
          action={[
            <Button key="undo" color="secondary" size="small"
              onClick={this.refreshList}>
              REFRESH
            </Button>,
            <Button key="close" color="secondary" size="small"
            onClick={this.handleSnackBarClose}>
            CLOSE
          </Button>
          ]}
        />
      </div>
    )
  }
  //endregion

  //region Transaction Table
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

  renderTransactionTable() {
    console.log(`Render Transaction Table`);
    return (
      <table className="table-hover">
        <thead className="thead-light">
          <tr>
            { this.renderTableHeaders() }
          </tr>
        </thead>
        <tbody>
            { this.renderTableData() }
        </tbody>
      </table>
    )
  }
  //endregion

  //region Material Design Table
  renderMaterialTransactionTable() {
    return (
      <Paper className={materialStyles.root}>
        <Table className={materialStyles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Address</TableCell>
              <TableCell numeric>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.paymentTransactions.map(n => {
              if (n.from !== undefined) {
                const formattedNowTime = moment(n.created_at, 'YYYY-MM-DDTHH:mm:ssZ').fromNow();
                const formattedDate = moment(n.created_at).format('lll')
                const displayDate = `${formattedNowTime}${formattedDate}`
                return (
                  <TableRow key={n.id}>
                    <TableCell>
                      <div className={styles.tableCellMultiLine}>
                        <div><b>{formattedNowTime}</b></div>
                        <div style={{marginTop: '0.5rem'}}>{formattedDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>{n.from}</TableCell>
                    <TableCell>{numeral(n.amount).format('0,0.00')}</TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
  //endregion

  renderContent() {
    console.log(`Render content || state: ${this.state.selectedMenuItem}`)
    switch(this.state.selectedMenuItem) {
      case 'TRANSACTIONS':
        return (
          <div>
            { this.renderMaterialTransactionTable() }
          </div>
        )
      break;
      case 'SEND':
        return (
          <div style={{width: '60%'}}>
            { this.renderSendMoneySection() }
          </div>
        )
      break;
      case 'RECEIVE':
        return (
          <div className={styles.receiveContainer}>
            { this.renderReceiveMoneySection() }
          </div>
        )
      break;
    }
  }

  render () {
    return (
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageContentContainer}>
          { !isEmpty(this.props.currentAccount) && this.renderAccountInfoContent() }
          { this.renderTabs() }
          <div className={styles.mainPageComponentContainer}>
            { this.renderContent() }
          </div>
          { this.renderSnackBar() }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accounts: getAccounts(state),
    currentAccount: getCurrentAccount(state),
    incomingPayment: getIncomingPayment(state),
    paymentTransactions: getPaymentTransactions(state)
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