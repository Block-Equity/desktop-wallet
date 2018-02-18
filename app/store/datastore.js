/* eslint-disable */

const electron = require('electron');
const userDataPath = (electron.app || electron.remote.app).getPath('appData');
var Datastore = require('nedb')
  , path = require('path')
  , db = new Datastore({ filename: path.join(userDataPath, 'user.db'), autoload: true });

  const NO_DATA = 0;
  const DOCUMENT_ID = 0;
  const DOCUMENT_TYPE_USER_INFO = 'userInfo';

  export function initUserDB(cb) {
    db.findOne({type: DOCUMENT_TYPE_USER_INFO}, (err, doc) => {
      if (doc == null) {
        var newDoc  = { type: DOCUMENT_TYPE_USER_INFO, accounts: [] };
        db.insert(newDoc, (err, newDocument) => {
          cb(newDocument.accounts, false);
        });
      } else {
        cb(doc.accounts, true);
      }
    });
  }

  export function initialCreationOfUserInfo(cb) {
    db.count({}, (err, count) => {
        if (count == NO_DATA) {
          var doc = { user: { accounts: [] } };
          db.insert(doc, (err, newDoc) => {   
            console.log(`New DB!   ||   Data: ${JSON.stringify(newDoc)}`);
            cb(newDoc.user.accounts);
          });
        } else {
          db.find({}, (err, doc) => {
            console.log(`DB Exists  ||  Data: ${JSON.stringify(doc)}`);
            cb(doc[DOCUMENT_ID].user.accounts);
          });
        }
      });
  }

  export function addUserAccount(pKey, balance, sequence, cb) {
    var accountCreated = { pKey: pKey, balance: balance, sequence: sequence }
    db.update({ }, { $addToSet: { 'user.accounts': accountCreated } }, {returnUpdatedDocs: true, multi: false}, 
        (err, numReplaced, affectedDocuments) => {
        console.log(`Updated: ${numReplaced} || Data: ${JSON.stringify(affectedDocuments)}`);
        cb(affectedDocuments.user.accounts);
    });
  }

  //Transaction
  //https://www.stellar.org/developers/js-stellar-base/reference/building-transactions.html
  export function setTransactionSequence(account, sequence) {
    //updated sequence ready for next transaction
    db.update({pkey: account}, { $set: { sequence: sequence }}, { returnUpdatedDocs: true }, 
       (err, numReplaced, affectedDocuments) => {

    });
  }

  export function getTransactionSequence() {
    //last sequence used
  }

  export function clearAllUserInfo(cb) {
    db.remove({}, { multi: true }, function (err, numRemoved) {
        cb();
        console.log('Document successfully removed');
    });
  }