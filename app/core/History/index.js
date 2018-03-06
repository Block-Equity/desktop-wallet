import React, { Component } from 'react'

import styles from './style.css'
import { withStyles } from 'material-ui/styles'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'

import numeral from 'numeral'
import moment from 'moment'

const materialStyles = theme => ({
  root: {
    width: '80%',
    height: '90%',
    marginTop: theme.spacing.unit * 3,
    overflowY: undefined
  },
  table: {
    minWidth: 600,
  }
})

class History extends Component {
  renderTableBody() {
    return this.props.paymentTransactions.map(n => {
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
    })
  }

  render() {
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
            { this.renderTableBody() }
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

export default History