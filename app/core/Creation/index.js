import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'

class AccountCreation extends Component {
  render() {
    return (
      <div>

      </div>
    )
  }
}

/*const mapStateToProps = (state) => {
  return {
    accounts: getAccounts(state),
    currentAccount: getCurrentAccount(state),
    incomingPayment: getIncomingPayment(state),
    paymentTransactions: getPaymentTransactions(state)
  }
}*/

export default connect(null, null)(AccountCreation)