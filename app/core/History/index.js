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

const tableRowStyle = {
  fontFamily: font,
  fontSize: '0.8rem',
  fontWeight: '400',
  color: '#111111'
}

const TRANSACTION_TYPE = {
  Payment: 'payment',
  CreateAccount: 'create_account',
  ChangeTrust: 'change_trust',
  SetOptions: 'set_options'
}

class History extends Component {

  renderTableBody() {
    const { currentAccount } = this.props
    const type = currentAccount.asset_type
    const code = currentAccount.asset_code
    var displayDataAllAssets = []
    var displayData = []

    this.props.paymentTransactions.map(n => {
      if (n.type === TRANSACTION_TYPE.CreateAccount || n.type === TRANSACTION_TYPE.Payment) {
        var obj
        if (n.type === TRANSACTION_TYPE.CreateAccount ) {
          obj = {
            ...n,
            asset_type: 'native'
          }
          displayDataAllAssets.push(obj)
        } else {
          displayDataAllAssets.push(n)
        }
      }
    })

    displayDataAllAssets.map(n => {
      if (currentAccount.asset_type === 'native') {
        if (n.asset_type === 'native') {
          const obj = this.getDisplayObject(n, currentAccount)
          displayData.push(obj)
        }
      } else {
        if (currentAccount.asset_code === n.asset_code) {
          const obj = this.getDisplayObject(n, currentAccount)
          displayData.push(obj)
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
          <TableCell style={tableRowStyle}>{ displayAmount }</TableCell>
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
    if (n.type === TRANSACTION_TYPE.Payment) {
      displayAddress = n.from === currentAccount.pKey ? n.to : n.from
      displayAmount = n.from === currentAccount.pKey ? numeral(`-${n.amount}`).format('(0,0.00)') : numeral(n.amount).format('0,0.00')
      displayTypeLabel = n.from === currentAccount.pKey ? `Payment sent ` : `Payment received `
    } else if (n.type === TRANSACTION_TYPE.CreateAccount) {
      displayAddress = n.source_account === currentAccount.pKey ? n.account : n.source_account
      displayAmount = n.source_account === currentAccount.pKey ? numeral(`-${n.starting_balance}`).format('(0,0.00)') : numeral(n.starting_balance).format('0,0.00')
      displayTypeLabel = n.source_account === currentAccount.pKey ? `Account created ` : `Account created by `
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
      <Table className={materialStyles.table} style={{height: '23rem'}}>
        <TableHead>
          <TableRow>
            <TableCell style={tableHeaderStyle}>Description</TableCell>
            <TableCell style={tableHeaderStyle}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { this.renderTableBody() }
        </TableBody>
      </Table>
    )
  }
}

export default History