import bip39 from 'bip39'
import has from 'lodash/has'

/**
 * Generate a mnemonic using BIP39
 * @param {Object} props Properties defining how to generate the mnemonic
 * @param {Number} [props.strength=256] Entropy bits (default is 24 word mnemonic)
 * @param {string} [props.language='english'] name of a language wordlist as defined in the 'bip39' npm module.
 * @param {function} [props.rng] RNG function (default is crypto.randomBytes)
 * @return {String} A string of space delimited words representing the mnemonic
 */
export const generate = ({ strength = 256, language = 'english', rngFn = undefined } = {}) => {
  if (!has(bip39.wordlists, language)) {
    throw new Error(`Language ${language} not suported`)
  }
  const wordlist = bip39.wordlists[language]
  return bip39.generateMnemonic(strength, rngFn, wordlist)
}

/**
 * Generate a seed hex from a mnemoic using BIP39
 * @param {Object} mnemonic Properties defining how to generate the mnemonic
 * @param {Number} [passwords] Optional mnemonic password
 * @return {String} The seed as hex
 */
export const toSeedHex = (mnemonic, password = undefined) => {
  return bip39.mnemonicToSeedHex(mnemonic, password)
}
