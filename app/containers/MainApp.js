/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initDB } from '../actions/userStateAction';
import { addUserAccount } from '../store/datastore';
import { isEmpty } from '../utils/utility';
import QRCode from 'qrcode.react';

import styles from './MainApp.css';
import walletIcon from '../assets/icnWallet.png';
import settingIcon from '../assets/icnSettings.png';

import { createSeed, createTestAccount, getAccountDetail } from '../network/horizon';

const NAV_ICON_SIZE = 30;
const EMPTY = 0;

class MainViewPage extends Component {

  constructor(props) {
    super();
    this.state = {
      mainAccountAddress: '',
      mainAccountBalance: ''
    }
  }

  componentDidMount() {
    this.props.initDB();
  }  

  renderAccountInfoContent() {
    if (!isEmpty(this.props.accounts)) {
      this.state.mainAccountAddress = this.props.accounts[0].pKey;
      this.state.mainAccountBalance = this.props.accounts[0].balance.balance;
      return (
        <div className={styles.mainPageContentContainer}> 
          <h3>{this.state.mainAccountAddress}</h3>
          <h5>Balance: {this.state.mainAccountBalance} </h5>
          <QRCode value={this.state.mainAccountAddress} size={100} />
        </div>
      )
    }
  }

  renderSendMoneySection() {
    
  }

  render() {
    return (
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageNavContainer}>
          <img src={walletIcon} alt="" width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
          <img src={settingIcon} className={styles.mainPageNavContainerSpacer} alt="" width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
        </div>
        { this.renderAccountInfoContent() }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    accounts: state.userAccounts
  }
}

export default connect(mapStateToProps, { initDB }) (MainViewPage);
