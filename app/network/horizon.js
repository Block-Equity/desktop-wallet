import StellarSdk, { Config } from 'stellar-sdk'
import axios from 'axios'
import { addUserAccountToDB } from '../store/datastore'

// Horizon API Setup
// TODO: BAD PRACTICE - Secure Server
Config.setAllowHttp(true)
StellarSdk.Network.useTestNetwork()

// TODO: move this into a configuration file
const BASE_URL_TEST_NET = 'http://ec2-18-219-131-250.us-east-2.compute.amazonaws.com/'
const BASE_URL_HORIZON_TEST_NET = 'https://horizon-testnet.stellar.org'
const BASE_URL = BASE_URL_TEST_NET
const server = new StellarSdk.Server(BASE_URL)

const createTestAccount = (publicKey) => {
  // Friend Bot is only on Horizon Test Net
  return axios.get(`${BASE_URL_HORIZON_TEST_NET}/friendbot?addr=${publicKey}`)
}

// TODO: Perhaps this should go somewhere else, as it doesn't really have much to do with Horizon
export const createSeed = () => {
  const pair = StellarSdk.Keypair.random()

  // TODO: Secret Key as mnemonic words
  const secretKey = pair.secret()
  const publicKey = pair.publicKey()

  console.log(`Secret: ${secretKey} || Public: ${publicKey}`)

  return {
    publicKey,
    secretKey
  }
}

// TODO: possibly do some try/catch logic in here to catch potential errors
export const createAccount = async () => {
  const { publicKey, secretKey } = await createSeed()
  await createTestAccount(publicKey)

  const { balance, sequence } = await getAccountDetail(publicKey)

  const accounts = await addUserAccountToDB({
    publicKey,
    secretKey,
    balance,
    sequence
  })

  return accounts
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
    balance: latest.balance,
    sequence: account.sequence
  }
}

export const sendPayment = ({ publicKey, secretKey, sequence, destinationId, amount }) => {
  let sourceKeys = StellarSdk.Keypair.fromSecret(secretKey)
  let transaction

  // TODO: let's clean this up so it's more step driven
  return new Promise((resolve, reject) => {
    server.loadAccount(destinationId)
      // If the account is not found, surface a nicer error message for logging.
      .catch(StellarSdk.NotFoundError, error => {
        reject(error)
      })
      // If there was no error, load up-to-date information on your account.
      .then(() => server.loadAccount(publicKey))
      .then(sourceAccount => {
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
          .build()

        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys)
        // And finally, send it off to Stellar!
        return server.submitTransaction(transaction)
      })
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        reject(error)
        // If the result is unknown (no response body, timeout etc.) we simply resubmit
        // already built transaction:
        // server.submitTransaction(transaction);
      })
  })
}
