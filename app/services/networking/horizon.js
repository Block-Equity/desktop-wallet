import StellarSdk, { Config } from 'stellar-sdk'
//import config from '../../../config' //TODO: Issues with getting production config variable in production build
import { StellarWallet } from '../security/wallet'
import { generate as generateMnemonic } from '../security/mnemonic'

import axios from 'axios'

// Horizon API Setup
// TODO: BAD PRACTICE - Secure Server
Config.setAllowHttp(true)
StellarSdk.Network.useTestNetwork()

const BASE_URL_TEST_NET = 'https://stellar-testnet.blockeq.com/'
const BASE_URL_HORIZON_TEST_NET = 'https://horizon-testnet.stellar.org'
//const BASE_URL_HORIZON_PUBLIC_NET = 'https://stellar-pubnet.blockeq.com/'
const BASE_URL_HORIZON_PUBLIC_NET = 'https://horizon.stellar.org'
const BASE_URL = BASE_URL_HORIZON_TEST_NET
const server = new StellarSdk.Server(BASE_URL)

export const fundAccount = (publicKey) => {
  // Friend Bot is only on Horizon Test Net
  return axios.get(`${BASE_URL_HORIZON_TEST_NET}/friendbot?addr=${publicKey}`)
}

export const getAccountDetail = async (publicKey) => {
  let account = await server.loadAccount(publicKey)

  console.log('Balances for account:', publicKey)

  // Just in case loading the account fails to retrieve the balances, immediately throw
  // an exception
  if (!account.balances.length) {
    throw new Error('Unable to retrieve balance')
  }

  // Grab the latest one
  let latest = account.balances[account.balances.length - 1]

  return {
    balance: latest,
    sequence: account.sequence
  }
}

export const getPaymentOperationList = async (publicKey) => {
  return new Promise((resolve, reject) => {
    server.operations()
      .forAccount(publicKey)
      .order('desc')
      .limit(25)
      .call()
      .then(({ records }) => resolve(records))
      .catch(error => reject(error));
  })
}

export const receivePaymentStream = async (publicKey) => {
  return new Promise(resolve => {
    server.payments()
      .cursor('now')
      .forAccount(publicKey)
      .stream({
        onmessage: message => resolve(message)
      })
  })
}

export const sendPayment = ({ publicKey, decryptSK, sequence, destinationId, amount }) => {
  let sourceKeys = StellarSdk.Keypair.fromSecret(decryptSK)
  let transaction

  return new Promise((resolve, reject) => {
    server.loadAccount(destinationId)
      // If the account is not found, then create a transaction for creating an account
      .catch(error => {
        console.log(error.name)
        if (error.name === 'NotFoundError') {
          resolve({
            exists: false,
            payload: error
          })
        }
      })
      // If there was no error, load up-to-date information on your account.
      .then(() => server.loadAccount(publicKey))
      .then(sourceAccount => {
        //sourceAccount.incrementSequenceNumber()
        console.log(`Next Sequence: ${sourceAccount.sequenceNumber()}`)
        transaction = new StellarSdk.TransactionBuilder(sourceAccount)
          .addOperation(StellarSdk.Operation.payment({
            destination: destinationId,
            // Because Stellar allows transaction in many currencies, you must
            // specify the asset type. The special "native" asset represents Lumens.
            asset: StellarSdk.Asset.native(),
            amount: amount.toString()
          }))
          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Stellar treats the transaction.
          .addMemo(StellarSdk.Memo.text('Test Transaction'))
          .build()

        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys)
        // And finally, send it off to Stellar!
        return server.submitTransaction(transaction)
      })
      .then(result => {
        resolve({
          exists:true,
          payload: result
        })
      })
      .catch(error => {
        reject(error)
        // If the result is unknown (no response body, timeout etc.) we simply resubmit
        // already built transaction:
        // server.submitTransaction(transaction);
      })
  })
}

export const createDestinationAccount = ({ decryptSK, publicKey, destination, amount, sequence }) => {
  console.log(`SK: ${decryptSK} || PK: ${publicKey} || Destination: ${destination} || Amount: ${amount} || Sequence: ${sequence}`)
  let sourceKeys = StellarSdk.Keypair.fromSecret(decryptSK)
  var transaction
  return new Promise((resolve, reject) => {
    server.loadAccount(publicKey)
    .then(sourceAccount => {
      sourceAccount.incrementSequenceNumber()
      transaction = new StellarSdk.TransactionBuilder(sourceAccount)
        .addOperation(StellarSdk.Operation.createAccount({
          destination: destination,
          startingBalance: amount.toString()
        }))
        .build()

        transaction.sign(sourceKeys)

        server.submitTransaction(transaction)
        .then( transactionResult => {
          console.log(JSON.stringify(transactionResult, null, 2));
          console.log('\nSuccess! View the transaction at: ');
          console.log(transactionResult._links.transaction.href);
          resolve(transactionResult._links.transaction.href)
        })
        .catch( err => {
          console.log('An error has occured:');
          console.log(err);
          reject(err)
        });
    })
  })
}
