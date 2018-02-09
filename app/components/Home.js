// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import mainLogo from '../assets/beLaunchLogoGray.png';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <img src={mainLogo} width="150" height="77" alt="" />
          <h2>BlockEQ Wallet</h2>
          <Link to="/wallet">
            <button
              type="button"
              className="btn btn-outline-success"
            >Launch
            </button>
          </Link>
        </div>
      </div>
    );
  }
}
