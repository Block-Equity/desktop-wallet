import StellarSdk, { Config } from 'stellar-sdk'
//import config from '../../../config' //TODO: Issues with getting production config variable in production build
import { StellarWallet } from '../security/wallet'
import { generate as generateMnemonic } from '../security/mnemonic'
import axios from 'axios'
var EventSource = require('eventsource')

Config.setAllowHttp(true)
StellarSdk.Network.usePublicNetwork()

const BASE_URL_TEST_NET = 'https://stellar-testnet.blockeq.com/'
const BASE_URL_HORIZON_TEST_NET = 'https://horizon-testnet.stellar.org'
//const BASE_URL_HORIZON_PUBLIC_NET = 'https://stellar-pubnet.blockeq.com/'
export const BASE_URL_HORIZON_PUBLIC_NET = 'https://horizon.stellar.org'
const BASE_URL = BASE_URL_HORIZON_PUBLIC_NET
const server = new StellarSdk.Server(BASE_URL)
const INFLATION_DESTINATION = 'GCCD6AJOYZCUAQLX32ZJF2MKFFAUJ53PVCFQI3RHWKL3V47QYE2BNAUT'
const STELLAR_CODE = 'XLM'

export const fundAccount = (publicKey) => {
  // Friend Bot is only on Horizon Test Net
  return axios.get(`${BASE_URL_HORIZON_TEST_NET}/friendbot?addr=${publicKey}`)
}

export const getAccountDetail = async (publicKey) => {
  let account = await server.loadAccount(publicKey)

  if (!account.balances.length) {
    console.log('Account does not exist')
    throw new Error('Unable to retrieve balance')
  }

  return {
    balances: account.balances,
    sequence: account.sequence,
    type: 'Stellar',
    subentryCount: account.subentry_count,
    signers: account.signers,
    inflationDestination: account.inflation_destination
  }
}

export const getPaymentOperationList = async (publicKey) => {
  return new Promise((resolve, reject) => {
    server.operations()
      .forAccount(publicKey)
      .order('desc')
      .limit(200)
      .call()
      .then(({ records }) => resolve(records))
      .catch(error => reject(error))
  })
}

export const getEffectsOnAccount = (publicKey) => {
  return new Promise((resolve, reject) => {
    server.effects()
    .forAccount(publicKey)
    .order('desc')
    .limit(200)
    .call()
    .then( ({ records }) => {
      resolve({ payload: records, error: false })
    })
    .catch( error =>
      reject({ errorMessage: error, error: true })
    )
  })
}

export const getTransactionList = async (publicKey) => {
  return new Promise((resolve, reject) => {
    server.transactions()
    .forAccount(publicKey)
    .order('desc')
    .limit(200)
    .call()
    .then(({ records }) => {
      resolve(records)
    })
    .catch(error => reject(error))
  })
}

export const sendPayment = ({ publicKey, decryptSK, sequence, destinationId, amount, memoID, issuerPK, assetType }) => {
  let sourceKeys = StellarSdk.Keypair.fromSecret(decryptSK)
  let transaction

  var blockEQToken = new StellarSdk.Asset(assetType, issuerPK)

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
        transaction = new StellarSdk.TransactionBuilder(sourceAccount)
          .addOperation(StellarSdk.Operation.payment({
            destination: destinationId,
            // Because Stellar allows transaction in many currencies, you must
            // specify the asset type. The special "native" asset represents Lumens.
            asset: assetType === STELLAR_CODE ? StellarSdk.Asset.native() : blockEQToken,
            amount: amount.toString()
          }))
          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Stellar treats the transaction.
          .addMemo(memoID.length === 0 ? StellarSdk.Memo.text('No memo defined') : StellarSdk.Memo.id(memoID))
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
  let sourceKeys = StellarSdk.Keypair.fromSecret(decryptSK)
  var transaction
  return new Promise((resolve, reject) => {
    server.loadAccount(destination)
    // If the account is not found, then create a transaction for creating an account
    .catch(error => {
      console.log(error.name)
      reject({error: true, errorMessage: error.name})
    })
    // If there was no error, load up-to-date information on your account.
    .then(() => server.loadAccount(publicKey))
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
          resolve({
            payload: transactionResult._links.transaction.href,
            error: false
          })
        })
        .catch( err => {
          console.log('An error has occured:');
          console.log(err);
          reject({error: true, errorMessage: err})
        })
    })
  })
}

export const changeTrust = ({ decryptSK, publicKey, issuerPK, assetType }) => {
  let sourceKeys = StellarSdk.Keypair.fromSecret(decryptSK)
  var blockEQToken = new StellarSdk.Asset(assetType, issuerPK)
  return new Promise((resolve, reject) => {
    server.loadAccount(publicKey)
    .catch(error => {
      console.log(error.name)
      reject({
        error: true,
        errorMessage: error.name
      })
    })
    // If there was no error, load up-to-date information on your account.
    .then(sourceAccount => {
      var transaction = new StellarSdk.TransactionBuilder(sourceAccount)
        .addOperation(StellarSdk.Operation.changeTrust({
          asset: blockEQToken
        }))
        .build()

        transaction.sign(sourceKeys)

        server.submitTransaction(transaction)
        .then( transactionResult => {
          resolve({
            payload: 'Success',
            error: false
          })
        })
        .catch( err => {
          console.log('An error has occured:');
          console.log(err);
          reject({error: true, errorMessage: err})
        })
    })
  })
}

export const joinInflationDestination = ( sk, pk ) => {
  let sourceKeys = StellarSdk.Keypair.fromSecret(sk)
  return new Promise((resolve, reject) => {
    server.loadAccount(pk)
    .catch(error => {
      reject({ errorMessage: error.name, error: true })
    })
    .then(sourceAccount => {
      var transaction = new StellarSdk.TransactionBuilder(sourceAccount)
        .addOperation(StellarSdk.Operation.setOptions({ inflationDest: INFLATION_DESTINATION }))
        .build()
      transaction.sign(sourceKeys)

      server.submitTransaction(transaction)
      .then( transactionResult => {
        resolve({ payload: transactionResult, error: false })
      }).catch( err => {
        console.log(err);
        reject({ errorMessage: err, error: true })
      })
    })
  })
}

export const getOrderBook = (sellingAsset, sellingAssetIssuer, buyingAsset, buyingAssetIssuer) => {
  const sellAsset = sellingAsset === STELLAR_CODE ? new StellarSdk.Asset.native() : new StellarSdk.Asset(sellingAsset, sellingAssetIssuer)
  const buyAsset = buyingAsset === STELLAR_CODE ? new StellarSdk.Asset.native() : new StellarSdk.Asset(buyingAsset, buyingAssetIssuer)
  return new Promise((resolve, reject) => {
    server.orderbook(sellAsset, buyAsset)
    .call()
    .then(response => {
        console.log(response)
        resolve({ payload: response, error: false })
      }
    )
    .catch(err => {
        console.log(err)
        reject({ errorMessage: err, error: true })
      }
    )
  })
}

export const getOpenOrders = (pk) => {
  return new Promise((resolve, reject) => {
    server.offers('accounts', pk)
    .order('desc')
    .limit(200)
    .call()
    .then(({ records }) => {
      resolve({ payload: records, error: false })
    })
    .catch(error => reject({ errorMessage: error, error: true }))
  })
}

export const manageOffer = (sellingAsset, sellingAssetIssuer, buyingAsset, buyingAssetIssuer, amount, price, sk, pk) => {
  let sourceKeys = StellarSdk.Keypair.fromSecret(sk)
  const sellAsset = sellingAsset === STELLAR_CODE ? new StellarSdk.Asset.native() : new StellarSdk.Asset(sellingAsset, sellingAssetIssuer)
  const buyAsset = buyingAsset === STELLAR_CODE ? new StellarSdk.Asset.native() : new StellarSdk.Asset(buyingAsset, buyingAssetIssuer)
  return new Promise((resolve, reject) => {
    server.loadAccount(pk)
    .catch(error => {
      reject({ errorMessage: error.name, error: true })
    })
    .then(sourceAccount => {
      var transaction = new StellarSdk.TransactionBuilder(sourceAccount)
        .addOperation(StellarSdk.Operation.manageOffer({
            selling: sellAsset,
            buying: buyAsset,
            amount,
            price,
            offerId: 0
          })
        )
        .build()
      transaction.sign(sourceKeys)

      server.submitTransaction(transaction)
      .then( result => {
        console.log(`Manage offer success: ${JSON.stringify(result)}`)
        resolve({ payload: 'Success', error: false })
      }).catch( err => {
        console.log(err);
        reject({ errorMessage: err, error: true })
      })
    })
  })
}

export const deleteOffer = (sellingAsset, sellingAssetIssuer, buyingAsset, buyingAssetIssuer, price, sk, pk, offerId) => {
  let sourceKeys = StellarSdk.Keypair.fromSecret(sk)
  const sellAsset = sellingAsset === STELLAR_CODE ? new StellarSdk.Asset.native() : new StellarSdk.Asset(sellingAsset, sellingAssetIssuer)
  const buyAsset = buyingAsset === STELLAR_CODE ? new StellarSdk.Asset.native() : new StellarSdk.Asset(buyingAsset, buyingAssetIssuer)
  return new Promise((resolve, reject) => {
    server.loadAccount(pk)
    .catch(error => {
      reject({ errorMessage: error.name, error: true })
    })
    .then(sourceAccount => {
      var transaction = new StellarSdk.TransactionBuilder(sourceAccount)
        .addOperation(StellarSdk.Operation.manageOffer({
            selling: sellAsset,
            buying: buyAsset,
            amount: '0.0000000',
            price,
            offerId
          })
        )
        .build()
      transaction.sign(sourceKeys)

      server.submitTransaction(transaction)
      .then( result => {
        resolve({ payload: 'Success', error: false })
      }).catch( err => {
        console.log(err);
        reject({ errorMessage: err, error: true })
      })
    })
  })
}

export const getTradeHistory = (pk) => {
  const url = `${BASE_URL}/accounts/${pk}/trades?order=desc&limit=200&`
  return new Promise((resolve, reject) => {
    axios.get(url)
    .then( response => {
      var records = response.data._embedded.records
      resolve({ records, error: false })
    })
    .catch( error => {
      reject({ errorMessage: error, error: true })
    })
  })
}