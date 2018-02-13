/* eslint-disable */

import React, { Component } from 'react';
import Home from '../components/Home';
import LocalStore from '../store/store';

type Props = {};

//Local Store Initialization
const STORE_FILE_USER_PREFERENCES = 'horizon-user-preferences';
var store;

export default class HomePage extends Component<Props> {
  props: Props;

  componentDidMount() {
    store = new LocalStore({
      configName: STORE_FILE_USER_PREFERENCES,
      defaults: {
        accounts: []
      }
    });
  }

  render() {
    return (
      <Home />
    );
  }
}
