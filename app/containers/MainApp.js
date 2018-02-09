import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './MainApp.css';
import walletIcon from '../assets/icnWallet.png';


class MainViewPage extends Component {
  render() {
    return (
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageContainer}>
          <img src={walletIcon} alt="" width="75" height="75" />
        </div>
        <div className={styles.mainPageContainer} />
      </div>
    );
  }
}

export default MainViewPage;
