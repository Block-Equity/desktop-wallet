/* eslint-disable */

import React, { Component } from 'react';
import Home from '../components/Home';

class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //TODO: Remove below for production. Only for testing.
    clearAllUserInfo(cb => {

    });
  }

  render() {
    return (
      <Home />
    );
  }
}

export default HomePage;