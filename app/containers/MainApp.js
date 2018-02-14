/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserAccount } from '../actions/userStateAction';
import { addUserAccount } from '../store/datastore';

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
      console.log(this.props.accounts.length);
    }
      
  }

  networkCalls() {
    createSeed(publicKey => {
        createTestAccount(publicKey, response => {
            getAccountDetail(publicKey, response => {
              this.appendAccountDB(publicKey);
            });
        }, failure => {

        });
      })
  }

  appendAccountDB(publicKey) {
    addUserAccount(publicKey, accounts => {
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
       
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.userAccounts
  }
}

export default connect(mapStateToProps, { setUserAccount }) (MainViewPage);
