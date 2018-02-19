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
      mainAccountBalance: '',
      sendAddress: '',
      sendAmount: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.initDB();
  }  

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState(
      {[name]: value}
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
      this.setState({
      invalid: true,
      displayErrors: true,
    });
      return;
    }

    console.log(`Valid Form Input || Account : ${this.state.sendAddress}`);
    console.log(`Valid Form Input || Amount : ${this.state.sendAmount}`);

    

    this.setState( {
      sendAddress: '',
      sendAmount: '',
      displayErrors: false
    });
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
    const { invalid, displayErrors } = this.state;

    var formStyle = "";

    if (displayErrors) {
      formStyle = styles.sendAssetFormDisplayErrors
    }

    return (
      <div className={styles.sendAssetFormContainer}>
          <form id="sendAssetForm" onSubmit={this.handleSubmit} noValidate 
          className={formStyle}>
          <div className="form-group">
            <label className={styles.sendAssetFormLabel} htmlFor="sendAddress">Send to address: </label>
            <input type="text" className="form-control" placeholder="Send Address" 
              id="sendAddress" name="sendAddress" value={this.state.sendAddress} onChange={this.handleChange} required></input>
          </div>
          <div className="form-group">
            <label className={styles.sendAssetFormLabel} htmlFor="sendAmount">Amount in XLM: </label>
            <input type="text" className="form-control" placeholder="Amount in XLM" 
              id="sendAmount" name="sendAmount" value={this.state.sendAmount} onChange={this.handleChange} required></input>
          </div>
          <button className="btn btn-outline-success" type="submit">Save</button>
        </form>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageNavContainer}>
          <img src={walletIcon} alt="" width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
          <img src={settingIcon} className={styles.mainPageNavContainerSpacer} alt="" width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
        </div>
        <div className={styles.mainPageContentContainer}> 
          { this.renderAccountInfoContent() }
          { this.renderSendMoneySection() }
        </div>
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
