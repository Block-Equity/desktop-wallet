import bip39 from 'bip39'
import has from 'lodash/has'
import LevensteinDistance from '../security/utilities/levenstein_distance'

const wordlists = {
  chinese_simplified: require('bip39/wordlists/chinese_simplified'),
  chinese_traditional: require('bip39/wordlists/chinese_traditional'),
  english: require('bip39/wordlists/english.json'),
  french: require('bip39/wordlists/french.json'),
  italian: require('bip39/wordlists/italian.json'),
  japanese: require('bip39/wordlists/japanese.json'),
  spanish: require('bip39/wordlists/spanish.json')
}

const vowelRe = /[aeiou]/g
const novowels = word => word.replace(vowelRe, '')

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

/**
 * Checks if a mnemonic seed is valid
 */
export const validSeed = (mnemonicSeed, language = 'english') => {
  try {
    mnemonicSeed = normalize(mnemonicSeed)
    console.log(`Normalized Seed || ${mnemonicSeed}`)
    assertValidSeed(mnemonicSeed, language)
    return {
      valid: true,
      error: null
    }
  } catch (err) {
    return {
      valid: false,
      error: err.message
    }
  }
}

function normalize (seed) {
  if (typeof seed !== 'string') {
    throw new TypeError('seed string required')
  }

  // TODO? use unorm module until String.prototype.normalize gets better browser support
  seed = seed.normalize('NFKD')// Normalization Form: Compatibility Decomposition
  seed = seed.replace(/\s+/g, ' ') // Remove multiple spaces in a row
  seed = seed.toLowerCase()
  seed = seed.trim()
  return seed
}

function assertValidSeed (mnemonicSeed, language = 'english') {
  if (!checkWords(mnemonicSeed, language)) {
    throw new Error('Invalid mnemonic seed')
  }
  const wordlist = validWordlist(language)
  if (!bip39.validateMnemonic(mnemonicSeed, wordlist)) {
    const words = mnemonicSeed.split(' ').length
    // user forgot to quote command line arg
    const shortStr = words < 11 ? `.  Mnemonic seeds are usually 12 words or more but this seed is only ${words} words.` : ''
    throw new Error(`Invalid mnemonic seed checksum${shortStr}`)
  }
}

function checkWords (seed = '', language = 'english') {
  const words = seed.split(' ')
  const wordlist = validWordlist(language)
  let word
  while ((word = words.pop()) != null) {
    const idx = wordlist.findIndex(w => w === word)
    if (idx === -1) {
      return false
    }
  }
  return true
}

function validWordlist (language) {
  const wordlist = wordlists[language]
  if (!wordlist) {
    throw new Error(`Missing wordlist for language ${language}`)
  }
  return wordlist
}

/**
 * Suggests words
 */

export function suggest (word = '', {maxSuggestions = 5, language = 'english'} = {}) {
  word = word.trim().toLowerCase()
  const nword = normalize(word)
  const wordlist = validWordlist(language)

  if (word === '') { return [] }

  // Words that begin the same, also handles perfect match
  let match = false
  const matches = wordlist.reduce((arr, w) => {
    if (w === word || match) {
      match = true
      return
    }
    if (w.indexOf(nword) === 0 && arr.length < 10) { arr.push(w) }

    return arr
  }, [])
  if (match) {
    return true
  }

  // Levenshtein distance
  if (!/chinese/.test(language)) {
    const levenstein = LevensteinDistance(wordlist)
    const lwords = levenstein(nword, {threshold: 0.5, language})
    lwords.forEach(w => { matches.push(w) })
  }

  if (language === 'english') {
    // Vowels are almost useless
    const nvword = novowels(nword)
    if (nvword !== '') {
      wordlist.reduce((arr, w) => {
        const score = novowels(w).indexOf(nvword)
        if (score !== -1) { arr.push([score, w]) }
        return arr
      }, [])
      .sort((a, b) => Math.sign(a[0], b[0]))
      .map(a => a[1])
      .forEach(w => { matches.push(w) })
    }
  }

  const dedupe = {}
  const finalMatches = matches.filter(item =>
    dedupe[item] ? false : dedupe[item] = true
  )

  // console.log('suggest finalMatches', word, finalMatches)
  return finalMatches.slice(0, maxSuggestions)
}