/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserAccount } from '../actions/userStateAction';
import { addUserAccount } from '../store/datastore';
import QRCode from 'qrcode.react';

import styles from './MainApp.css';
import walletIcon from '../assets/icnWallet.png';
import settingIcon from '../assets/icnSettings.png';

import { createSeed, createTestAccount, getAccountDetail } from '../network/horizon';

const NAV_ICON_SIZE = 30;

class MainViewPage extends Component {

  componentDidMount() {
    if (this.props.accounts.length == 0) {
      this.networkCalls();
    } else {
      console.log(this.props.accounts);
    }
  }

  networkCalls() {
    createSeed(publicKey => {
        createTestAccount(publicKey, response => {
            getAccountDetail(publicKey, balance => {
              this.appendAccountDB(publicKey, balance);
            });
        }, failure => {

        });
      })
  }

  appendAccountDB(publicKey, balance) {
    addUserAccount(publicKey, balance, accounts => {
      this.props.setUserAccount(accounts);
    });
  }       

  render() {
    return (
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageNavContainer}>
          <img src={walletIcon} alt="" width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
          <img src={settingIcon} className={styles.mainPageNavContainerSpacer} alt="" width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
        </div>
        <div className={styles.mainPageContentContainer}> 
          <h3>{this.props.mainAccountAddress}</h3>
          <h5>Balance: {this.props.mainAccountBalance} </h5>
          <QRCode value={this.props.mainAccountAddress} size={100} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.userAccounts,
    mainAccountAddress: state.userAccounts[0].pKey,
    mainAccountBalance: state.userAccounts[0].balance.balance
  }
}

export default connect(mapStateToProps, { setUserAccount }) (MainViewPage);
