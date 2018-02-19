/* eslint-disable */

import StellarSdk, { Config } from 'stellar-sdk';
import axios from 'axios';
import { addUserAccountToDB } from '../store/datastore';

//Horizon API Setup
Config.setAllowHttp(true); //TODO: BAD PRACTICE - Secure Server 
StellarSdk.Network.useTestNetwork();

const BASE_URL_TEST_NET = 'http://ec2-18-219-131-250.us-east-2.compute.amazonaws.com/';
const BASE_URL_HORIZON_TEST_NET = 'https://horizon-testnet.stellar.org';
const BASE_URL = BASE_URL_TEST_NET;
const server = new StellarSdk.Server(BASE_URL);

export function accountCreation(success) {
  createSeed(publicKey, secretKey => {
    createTestAccount(publicKey, response => {
      getAccountDetail(publicKey, (balance, sequence) => {
        addUserAccountToDB(publicKey, secretKey, balance, sequence, accounts => {
          success(accounts);
        });
      });
    }, failure => {

    })
  })
}

function createSeed(success) {
    const pair = StellarSdk.Keypair.random();
    let secretKey = pair.secret(); //TODO: Secret Key as mnemonic words
    let publicKey = pair.publicKey();
    console.log(`Secret: ${secretKey}  || Public: ${publicKey}`);
    success(publicKey, secretKey);
}

function createTestAccount(publicKey, success, failure) {
  //Friend Bot is only on Horizon Test Net
  const request = axios.get(`${BASE_URL_HORIZON_TEST_NET}/friendbot?addr=${publicKey}`)
    .then(response => {
      console.log('Success: ' + response);
      success(response);
    })
    .catch(error => {
      failure('Network call failed');
    });
}

export function getAccountDetail(publicKey, success) {
    server.loadAccount(publicKey)
    .then(account => {
        console.log('Balances for account: ' + publicKey);
        var accBalance;
        account.balances.forEach(function(balance) {
          console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
          accBalance = balance;
        });
        success(accBalance, account.sequence);
    });
}

export function buildTransaction(publicKey, sKey, sequence, destinationId, amount, success, failure) {
  var sourceKeys = StellarSdk.Keypair.fromSecret(sKey);
  var transaction;

  server.loadAccount(destinationId)
  // If the account is not found, surface a nicer error message for logging.
  .catch(StellarSdk.NotFoundError, function (error) {
    failure('The destination account does not exist!');
    throw new Error('The destination account does not exist!');
  })
  // If there was no error, load up-to-date information on your account.
  .then(function() {
    return server.loadAccount(publicKey);
  })
  .then(function(sourceAccount) {
    // Start building the transaction.
    transaction = new StellarSdk.TransactionBuilder(sourceAccount)
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationId,
        // Because Stellar allows transaction in many currencies, you must
        // specify the asset type. The special "native" asset represents Lumens.
        asset: StellarSdk.Asset.native(),
        amount: amount
      }))
      // A memo allows you to add your own metadata to a transaction. It's
      // optional and does not affect how Stellar treats the transaction.
      .addMemo(StellarSdk.Memo.text('Test Transaction'))
      .build();
    // Sign the transaction to prove you are actually the person sending it.
    transaction.sign(sourceKeys);
    // And finally, send it off to Stellar!
    return server.submitTransaction(transaction);
  })
  .then(function(result) {
    success(result);
    console.log('Success! Results:', result);
  })
  .catch(function(error) {
    failure(`Error Occured: ${error}`);
    console.error('Something went wrong!', error);
    // If the result is unknown (no response body, timeout etc.) we simply resubmit
    // already built transaction:
    // server.submitTransaction(transaction);
  });
}

