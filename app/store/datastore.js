/* eslint-disable */

const electron = require('electron');
const userDataPath = (electron.app || electron.remote.app).getPath('appData');
var Datastore = require('nedb')
  , path = require('path')
  , db = new Datastore({ filename: path.join(userDataPath, 'user.db'), autoload: true });

  const DOCUMENT_TYPE_USER_INFO = 'userInfo';

  export function initUserDB(cb) {
    db.findOne({type: DOCUMENT_TYPE_USER_INFO}, (err, doc) => {
      console.log(`UserDB || Data: ${JSON.stringify(doc)}`);
      if (doc == null) {
        console.log('Create New Document');
        var newDoc  = { type: DOCUMENT_TYPE_USER_INFO, accounts: [] };
        db.insert(newDoc, (err, newDocument) => {
          console.log(`Created new document! || Data: ${JSON.stringify(newDocument)}`);
          cb(newDocument.accounts, false);
        });
      } else {
        cb(doc.accounts, true);
      }
    });
  }

  export function addUserAccountToDB(pKey, sKey, balance, sequence, cb) {
    var accountCreated = { pKey: pKey, sKey: sKey, balance: balance, sequence: sequence }
    db.update({type: DOCUMENT_TYPE_USER_INFO}, { $addToSet: { 'accounts': accountCreated } }, {returnUpdatedDocs: true, multi: false}, 
        (err, numReplaced, affectedDocuments) => {
        console.log(`Updated: ${numReplaced} || Data: ${JSON.stringify(affectedDocuments)}`);
        cb(affectedDocuments.accounts);
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