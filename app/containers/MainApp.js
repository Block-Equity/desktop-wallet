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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.initDB();
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

    const form = event.target;
    const data = new FormData(form);

    for (let name of data.keys()) {
      const input = form.elements[name];
      const parserName = input.dataset.parse;
      if (parserName) {
        const parsedValue = inputParsers[parserName](data.get(name))
        data.set(name, parsedValue);
      }
    }

    console.log(`Valid Form Input || ${JSON.stringify(data)}`);
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

    return (
      <form id="sendAssetForm" onSubmit={this.handleSubmit} noValidate 
        className={displayErrors ? 'qsend-asset-form-display-errors send-asset-form-width' : 
        'send-asset-form-width'}>
        <div className="form-group">
          <label htmlFor="sendAddress">Send to address: </label>
          <input type="text" className="form-control" placeholder="Send Address" 
            id="sendAddress" name="sendAddress" required></input>
        </div>
        <div className="form-group">
          <label htmlFor="sendAmount">Amount in XLM: </label>
          <input type="text" className="form-control" placeholder="Amount in XLM" 
            id="sendAmount" name="sendAmount" required></input>
        </div>
        <button className="btn btn-outline-success" type="submit">Save</button>
      </form>
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
