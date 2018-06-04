import React, { Component } from 'react'

import styles from './style.css'
import { withStyles } from 'material-ui/styles'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'

import numeral from 'numeral'
import moment from 'moment'

const font = "'Lato', sans-serif";

const materialStyles = theme => ({
  table: {
    minWidth: '100%'
  }
})

const tableHeaderStyle = {
  fontFamily: font,
  backgroundColor: '#F7F7F7',
  color: '#777777',
  fontSize: '0.8rem',
  fontWeight: '400'
}

const tableHeaderAmountStyle = {
  ...tableHeaderStyle,
  textAlign: 'right'
}

const tableRowStyle = {
  fontFamily: font,
  fontSize: '0.8rem',
  fontWeight: '400',
  color: '#111111'
}

const tableAmountRowStyle = {
  ...tableRowStyle,
  textAlign: 'right'
}

const TRANSACTION_TYPE = {
  AccountCredited: 'account_credited',
  AccountDebited: 'account_debited',
  Trade: 'trade',
  ChangeTrust: 'trustline_created',
  CreateAccount: 'account_created',
  Payment: 'payment',
  SetOptions: 'set_options',
  ManageOffer: 'manage_offer'
}

class History extends Component {

  renderTableBody() {
    const { currentAccount } = this.props
    const type = currentAccount.asset_type
    const code = currentAccount.asset_code
    var displayData = []

    this.props.paymentTransactions.map(n => {
      if (currentAccount.asset_type === 'native') {
        if (n.type === 'trade') {
          if (n.bought_asset_type === 'native' || n.sold_asset_type === 'native') {
            const obj = this.getDisplayObject(n, currentAccount)
            displayData.push(obj)
          }
        } else {
          if (n.asset_type === 'native') {
            const obj = this.getDisplayObject(n, currentAccount)
            displayData.push(obj)
          }
        }
      } else {
        if (n.type === 'trade') {
          if (n.bought_asset_code === currentAccount.asset_code || n.sold_asset_code === currentAccount.asset_code) {
            const obj = this.getDisplayObject(n, currentAccount)
            displayData.push(obj)
          }
        } else {
          if (n.asset_code === currentAccount.asset_code) {
            const obj = this.getDisplayObject(n, currentAccount)
            displayData.push(obj)
          }
        }
      }
    })

    return displayData.map(data => {
      const { id, formattedNowTime, formattedDate, displayDate, displayAddress, displayAmount, displayTypeLabel } = data
      return (
        <TableRow key={id}>
          <TableCell style={tableRowStyle}>
            <div className={styles.tableCellMultiLine}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <b>{displayTypeLabel}</b>
                <i className="fa fa-circle" style={{color:'#A1A1A1', marginRight: '0.5rem', marginLeft: '0.5rem', marginTop: '0.45rem', fontSize: '0.4rem'}}></i>
                <div style={{color:'#A1A1A1', fontWeight: '300'}}>{formattedNowTime}</div>
              </div>
              <div style={{marginTop: '0.5rem', fontSize: '0.65rem'}}>{displayAddress}</div>
            </div>
          </TableCell>
          <TableCell style={tableAmountRowStyle}>{ displayAmount }</TableCell>
        </TableRow>
      )
    })
  }

  getDisplayObject(n, currentAccount) {
    const id = n.id
    const formattedNowTime = moment(n.created_at, 'YYYY-MM-DDTHH:mm:ssZ').fromNow();
    const formattedDate = moment(n.created_at).format('lll')
    const displayDate = `${formattedNowTime}${formattedDate}`
    var displayAddress, displayAmount, displayTypeLabel
    if (n.type === TRANSACTION_TYPE.AccountCredited) {
      //displayAddress = n.from === currentAccount.pKey ? n.to : n.from //Todo: Fetch from Operation API
      displayAmount = numeral(n.amount).format('0,0.00')
      displayTypeLabel = `Payment received`
    } else if (n.type === TRANSACTION_TYPE.AccountDebited) {
      displayAmount = numeral(n.amount).format('0,0.00')
      displayTypeLabel = `Payment sent`
    } else if (n.type === TRANSACTION_TYPE.CreateAccount) {
      //displayAddress = n.source_account === currentAccount.pKey ? n.account : n.source_account
      displayAmount = numeral(n.starting_balance).format('0,0.00')
      displayTypeLabel = `Account created`
    } else if (n.type === TRANSACTION_TYPE.Trade) {
      displayAddress = n.sold_asset_type === 'native' ? `Sold XLM for ${n.bought_asset_code}` : `Sold ${n.sold_asset_code} for ${n.bought_asset_code}`
      displayAmount = n.sold_asset_type === 'native' ? numeral(`-${n.amount*n.price}`).format('(0,0.00)') : numeral(n.amount*n.price).format('0,0.00')
      displayTypeLabel = 'Trade offers'
    }
    const displayObj = {
      id,
      formattedNowTime,
      formattedDate,
      displayDate,
      displayAddress,
      displayAmount,
      displayTypeLabel
    }
    return displayObj
  }

  render() {
    return (
      <div style={{height: '25.5rem', width: '100%'}}>
        <Table className={materialStyles.table} >
          <TableHead>
            <TableRow>
              <TableCell style={tableHeaderStyle}>Description</TableCell>
              <TableCell style={tableHeaderAmountStyle}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { this.renderTableBody() }
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default History