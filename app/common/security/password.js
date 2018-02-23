import crypto from 'crypto'

const DEFAULT_ENCODING = 'hex'

/**
 * Creates a password by derivung a key of the requested byte length (keylen) from the password, salt and iterations.
 * This is in line with OpenSSL's recommendation to use PBKDF2 instead of EVP_BytesToKey.
 * @param {string} text The text from which to generate a password
 */
export const create = (text, { iterations = 100000, keylen = 64, digest = 'sha512' } = {}) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(text, 'salt', iterations, keylen, 'sha512', (err, derivedKey) => {
      if (err) {
        reject(err)
        return
      }
      resolve(derivedKey.toString(DEFAULT_ENCODING))
    })
  })
}
