// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import mainLogo from '../assets/beLaunchLogoGray.png';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <img src = { mainLogo } width='150' height='77'/>
          <h2>Block Points</h2>
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }
}
