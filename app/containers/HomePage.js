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

const NO_DATA = 0;

class HomePage extends Component {

  constructor(props) {
    super(props);
    //this.props = props.bind(this);
  }

  componentDidMount() {
    this.loadDB( data => {
      this.props.setUserAccount(data);
    });
  }

  loadDB(cb) {
    db.count({}, function (err, count) {
      console.log(count);
      if (count !== NO_DATA) {
        //data exists
        db.find({}, function (err, doc) {
          cb(doc[0].user.accounts);
          //console.log(doc[0].user.accounts);
          //
          //this.state.setUserAccount(newDoc[0].user.accounts);
        });
      } else {
        //data doesn't exists
        var doc = { user: { accounts: [] } };
        db.insert(doc, function (err, newDoc) {   
          console.log(newDoc);
          cb(newDoc[0].user.accounts);
          //this.state.setUserAccount(newDoc[0].user.accounts);
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