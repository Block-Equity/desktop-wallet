import StellarSdk from 'stellar-sdk'
import { derivePath } from 'ed25519-hd-key'
import bip39 from 'bip39'
import has from 'lodash/has'
import isString from 'lodash/isString'

/**
 * Generate a mnemonic using BIP39
 * @param {Object} props Properties defining how to generate the mnemonic
 * @param {Number} [props.entropyBits=256] Entropy bits (default is 24 word mnemonic)
 * @param {string} [props.language='english'] name of a language wordlist as defined in the 'bip39' npm module.
 * @param {function} [props.rng] RNG function (default is crypto.randomBytes)
 */
export const generateMnemonic = ({ entropyBits = 256, language = 'english', rngFn = undefined } = {}) => {
  if (!has(bip39.wordlists, language)) {
    throw new TypeError(`Language ${language} not suported`)
  }
  const wordlist = bip39.wordlists[language]
  return bip39.generateMnemonic(entropyBits, rngFn, wordlist)
}

export const mnemonicToSeedHex = (mnemonic, password = undefined) => {
  return bip39.mnemonicToSeedHex(mnemonic, password)
}

class Wallet {
  /**
   * New instance from seed hex string
   * @param {string} seedHex Hex string
   */
  constructor (seedHex) {
    this.seedHex = seedHex
  }

  /**
   * Derive key given a full BIP44 path
   * @param {string} path BIP44 path string (ex for Stellar: m/44'/148'/8')
   * @return {Buffer} Key binary as Buffer
   */
  derive (path) {
    const data = derivePath(path, this.seedHex)
    return data.key
  }

  /**
 * Get account keypair for child key at given index
  * @param {Number} index Account index into a path (ex for Stellar: m/44'/148'/{index})
  * @return {stellar-base.Keypair} Keypair instance for the account
  */
  getKeypair (index) {
    throw new Error('Child class must implement')
  }

  /**
   * Get public key for account at index
   * @param {Number} index Account index into path m/44'/148'/{index}
   * @return {string} Public key
   */
  getPublicKey (index) {
    return this.getKeypair(index).publicKey()
  }

  /**
   * Get secret for account at index
   * @param {Number} index Account index into path m/44'/148'/{index}
   * @return {string} Secret
   */
  getSecret (index) {
    return this.getKeypair(index).secret()
  }
}

/**
 * Stellar-friendly SEP-0005 key derivation.
 * @see {@link https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0005.md|SEP-0005}
 */
export class StellarWallet extends Wallet {
  /**
   * Instance from a BIP39 mnemonic string.
   * @param {string} mnemonic A BIP39 mnemonic
   * @param {string} [password] Optional mnemonic password
   */
  static createFromMnemonic (mnemonic, password = undefined) {
    const seedHex = mnemonicToSeedHex(mnemonic, password)
    return new StellarWallet(seedHex)
  }

  /**
   * Instance from a seed
   * @param {(string|Buffer)} binary seed
   */
  static createFromSeed (seed) {
    let seedHex

    if (Buffer.isBuffer(seed)) {
      seedHex = seed.toString('hex')
    } else if (isString(seed)) {
      seedHex = seed
    } else {
      throw new TypeError('Invalid seed')
    }

    return new StellarWallet(seedHex)
  }

  /**
   * Get Stellar account keypair for child key at given index
   * @param {Number} index Account index into path m/44'/148'/{index}
   * @return {stellar-base.Keypair} Keypair instance for the account
   * @see {@link https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0005.md#multi-account-hierarchy-for-deterministic-wallets|SEP-0005}
   */
  getKeypair (index) {
    const key = this.derive(`m/44'/148'/${index}'`)
    return StellarSdk.Keypair.fromRawEd25519Seed(key)
  }
}
