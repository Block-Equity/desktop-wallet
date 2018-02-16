/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserAccount } from '../actions/userStateAction';
import Home from '../components/Home';
import { initialCreationOfUserInfo, clearAllUserInfo } from '../store/datastore';

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    initialCreationOfUserInfo( data => {
      this.props.setUserAccount(data);
    });
    /*clearAllUserInfo(cb => {

    });*/
  }

  render() {
    return (
      <Home />
    );
  }
}

export default connect(null, { setUserAccount })(HomePage);