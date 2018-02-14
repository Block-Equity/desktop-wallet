/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserAccount } from '../actions/userStateAction';
import Home from '../components/Home';
import { isUndefined } from '../utils/utility';

const electron = require('electron');
const userDataPath = (electron.app || electron.remote.app).getPath('appData');
var Datastore = require('nedb')
  , path = require('path')
  , db = new Datastore({ filename: path.join(userDataPath, 'user.db'), autoload: true });


class HomePage extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    db.find({ }, function (err, docs) {
      console.log(docs);
      if (docs.hasOwnProperty('user')) {
        console.log('User exists');
      } else {
        console.log('User does not exists');
        var doc = { user: { accounts: [] } };
        db.insert(doc, function (err, newDoc) {   
          console.log(newDoc);
        });
      }
    });
  }

  render() {
    return (
      <Home />
    );
  }
}

export default connect(null, { setUserAccount })(HomePage);