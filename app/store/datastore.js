/* eslint-disable */

const electron = require('electron');
const userDataPath = (electron.app || electron.remote.app).getPath('appData');
var Datastore = require('nedb')
  , path = require('path')
  , db = new Datastore({ filename: path.join(userDataPath, 'user.db'), autoload: true });

  const NO_DATA = 0;

  export function initialCreationOfUserInfo(cb) {
    db.count({}, function (err, count) {
        if (count !== NO_DATA) {
          db.find({}, function (err, doc) {
            console.log(`DB Exists  ||  Data: ${JSON.stringify(doc)}`);
            cb(doc[0].user.accounts);
          });
        } else {
          var doc = { user: { accounts: [] } };
          db.insert(doc, function (err, newDoc) {   
            console.log(`New DB!   ||   Data: ${JSON.stringify(newDoc)}`);
            cb(newDoc.user.accounts);
          });
        }
      });
  }

  export function addUserAccount(pKey, balance, cb) {
    db.find({ }, function (err, doc) {
        var accountCreated = { pKey: pKey, balance: balance }
        db.update({ }, { $addToSet: { 'user.accounts': accountCreated } }, {returnUpdatedDocs: true, multi: false}, 
            function (err, numReplaced, affectedDocuments) {
            console.log(`Updated: ${numReplaced} || Data: ${JSON.stringify(affectedDocuments)}`);
            cb(affectedDocuments.user.accounts);
        });
    });
  }

  export function clearAllUserInfo(cb) {
    db.remove({}, { multi: true }, function (err, numRemoved) {
        cb();
        console.log('Document successfully removed');
    });
  }