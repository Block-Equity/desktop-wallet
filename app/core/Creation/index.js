import React, { Component } from 'react'
import { connect } from 'react-redux'

//Material Design
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Chip from 'material-ui/Chip';

import styles from './style.css'

import logoIcon from './images/logo-white.png'

const sampleWords = [
  { key: 0, label: 'travel' },
  { key: 1, label: 'script' },
  { key: 2, label: 'glass' },
  { key: 3, label: 'tenant' },
  { key: 4, label: 'hood' },
  { key: 5, label: 'napkin' },
  { key: 6, label: 'path' },
  { key: 7, label: 'inform' },
  { key: 8, label: 'ensure' },
  { key: 9, label: 'tenant' },
  { key: 10, label: 'interest' },
  { key: 11, label: 'upon' },
  { key: 12, label: 'travel' },
  { key: 13, label: 'script' },
  { key: 14, label: 'glass' },
  { key: 15, label: 'tenant' },
  { key: 16, label: 'hood' },
  { key: 17, label: 'napkin' },
  { key: 18, label: 'path' },
  { key: 19, label: 'inform' },
  { key: 20, label: 'ensure' },
  { key: 21, label: 'tenant' },
  { key: 22, label: 'interest' },
  { key: 23, label: 'upon' }
]

const materialStyles = theme => ({
  chip: {
    margin: theme.spacing.unit / 2,
    padding: theme.spacing.unit
  },
});

class AccountCreation extends Component {
  render() {
    return (
      <div className={styles.container}>
        <nav className='navbar navbar-dark bg-dark'>
          <div className={styles.navContentContainer}>
            <img src={logoIcon} width='40' height='21' className="d-inline-block align-top" alt=""/>
            <h5 style={{marginLeft: '0.75rem'}}>Account Creation</h5>
          </div>
        </nav>
        <div style={{margin: '1rem', textAlign: 'center'}}>
          <Paper style={{padding: '2rem'}} elevation={2} square={false}>
            <Typography style={{marginBottom: '0.75rem'}} variant='subheading' component='h2' align='center'> RECOVERY PHRASE </Typography>
            <Typography component="p">
              The phrase is case sensitive. Please make sure you <b>write down and save your recovery phrase</b>. You will need this phrase to use and restore your wallet.
            </Typography>
            <div className={styles.chipContainer}>
              {sampleWords.map(data => {
                return (
                  <Chip
                    key={data.key}
                    label={`${data.key + 1}. ${data.label}`}
                    className={materialStyles.chip}
                    style={{marginLeft: '0.35rem', marginTop: '0.35rem', marginBottom: '0.35rem', backgroundColor:'#0F547E', color:'#FFFFFF'}}
                  />
                );
              })}
            </div>
            <button style={{padding: '0.5rem', paddingLeft: '2.5rem', paddingRight: '2.5rem'}} type="button" className="btn btn-dark">
              Yes, I have written it down.
            </button>
          </Paper>
        </div>
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