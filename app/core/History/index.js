import React, { Component } from 'react'

import styles from './style.css'
import { withStyles } from 'material-ui/styles'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'

import numeral from 'numeral'
import moment from 'moment'

const font = "'Lato', sans-serif";

const materialStyles = theme => ({
  root: {
    width: '70%',
    height: '90%',
    marginTop: theme.spacing.unit * 2,
    overflowY: undefined
  },
  table: {
    minWidth: 850
  }
})

const tableHeaderStyle = {
  fontFamily: font,
  backgroundColor: '#EFF5F9',
  color: '#777777',
  fontSize: '0.8rem',
  fontWeight: '400'
}

const tableRowStyle = {
  fontFamily: font,
  fontSize: '0.8rem',
  fontWeight: '400',
  color: '#111111'
}

const TRANSACTION_TYPE = {
  Payment: 'payment',
  CreateAccount: 'create_account'
}

class History extends Component {
  renderTableBody() {
    return this.props.paymentTransactions.map(n => {
      const formattedNowTime = moment(n.created_at, 'YYYY-MM-DDTHH:mm:ssZ').fromNow();
      const formattedDate = moment(n.created_at).format('lll')
      const displayDate = `${formattedNowTime}${formattedDate}`
      var displayAddress
      var displayAmount
      var displayTypeLabel
      if (n.type === TRANSACTION_TYPE.Payment) {
        displayAddress = n.from === this.props.pKey ? n.to : n.from
        displayAmount = n.from === this.props.pKey ? numeral(`-${n.amount}`).format('(0,0.00)') : numeral(n.amount).format('0,0.00')
        displayTypeLabel = n.from === this.props.pKey ? 'Payment sent' : 'Payment received'
      } else if (n.type === TRANSACTION_TYPE.CreateAccount) {
        displayAddress = n.source_account === this.props.pKey ? n.account : n.source_account
        displayAmount = n.source_account === this.props.pKey ? numeral(`-${n.starting_balance}`).format('(0,0.00)') : numeral(n.starting_balance).format('0,0.00')
        displayTypeLabel = n.source_account === this.props.pKey ? 'Account created for' : 'Account created by'
      } else {

      }

      return (
        <TableRow key={n.id}>
          <TableCell style={tableRowStyle}>
            <div className={styles.tableCellMultiLine}>
              <div><b>{formattedNowTime}</b></div>
              <div style={{marginTop: '0.5rem'}}>{formattedDate}</div>
            </div>
          </TableCell>
          <TableCell style={tableRowStyle}>
            <div className={styles.tableCellMultiLine}>
              <div><b>{displayTypeLabel}</b></div>
              <div style={{marginTop: '0.5rem', fontSize: '0.57rem'}}>{displayAddress}</div>
            </div>
          </TableCell>
          <TableCell style={tableRowStyle}>{ displayAmount }</TableCell>
        </TableRow>
      )
    })
  }

  render() {
    return (
      <Paper className={materialStyles.root}>
        <Table className={materialStyles.table}>
          <TableHead>
            <TableRow>
              <TableCell style={tableHeaderStyle}>Date</TableCell>
              <TableCell style={tableHeaderStyle}>Address</TableCell>
              <TableCell numeric style={tableHeaderStyle}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { this.renderTableBody() }
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

export default History