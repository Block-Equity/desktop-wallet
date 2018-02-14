/* eslint-disable */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserAccount } from '../actions/userStateAction';
import Home from '../components/Home';
import { isUndefined } from '../utils/utility';

import Datastore from 'nedb';
var db = new Datastore();

class HomePage extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    db.loadDatabase(function (err) {    
      db.find({}, function (err, docs) {
        console.log(`Error: ${err}`);
        console.log(`Data: ${docs.user.accounts}`);
        if (isUndefined(docs.user.accounts)) {
          var doc = { user: {
            accounts: []
          } };
          db.insert(doc, function (err, newDoc) {  
            // newDoc is the newly inserted document
            console.log(newDoc);
          });
        } else {
          console.log('Accounts Exist');
        }

      });
    });
  }

  render() {
    return (
      <Home />
    );
  }
}

export default connect(null, { setUserAccount })(HomePage);