import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './MainApp.css';
import walletIcon from '../assets/icnWallet.png';
import settingIcon from '../assets/icnSettings.png';

const NAV_ICON_SIZE = 30;

class MainViewPage extends Component {
  render() {
    return (
      <div className={styles.mainPageContainer}>
        <div className={styles.mainPageNavContainer}>
          <img src={walletIcon} alt="" width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
          <img src={settingIcon} className={styles.mainPageNavContainerSpacer} alt="" width={NAV_ICON_SIZE} height={NAV_ICON_SIZE} />
        </div>
        <div className={styles.mainPageContentContainer} />
      </div>
    );
  }
}

export default MainViewPage;
