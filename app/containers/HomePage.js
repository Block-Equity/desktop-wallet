/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserAccount } from '../actions/userStateAction';
import Home from '../components/Home';
import LocalStore from '../store/store';

type Props = {};

//Local Store Initialization
const STORE_FILE_USER_PREFERENCES = 'horizon-user-preferences';
var store;

class HomePage extends Component<Props> {
  props: Props;

  componentDidMount() {
    //Don't like this structure - think of less convuluding way
    store = new LocalStore({
      configName: STORE_FILE_USER_PREFERENCES,
      defaults: {
        accounts: []
      }
    });

    if (store.fileExists(STORE_FILE_USER_PREFERENCES)) {
      this.props.setUserAccount(store.get(STORE_FILE_USER_PREFERENCES));
    } 

  }

  render() {
    return (
      <Home />
    );
  }
}

export default connect(null, { setUserAccount })(HomePage);