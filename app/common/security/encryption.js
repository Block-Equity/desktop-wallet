import crypto from 'crypto'

const DEFAULT_ALGORITHM = 'aes-256-ctr'

/**
 * Encrypts a given buffer
 * @param {buffer} buffer The binary data
 * @param {string} password Used to derive the cipher key and initialization vector (IV). The value must be either a 'latin1' encoded string or a Buffer
 * @param {string} [algorithm='aes-256-ctr'] OpenSSL digest algorithm
 * @see https://nodejs.org/api/crypto.html#crypto_crypto_createdecipher_algorithm_password_options
 */
export const encryptBuffer = (buffer, password, algorithm = DEFAULT_ALGORITHM) => {
  let cipher = crypto.createCipher(algorithm, password)
  return Buffer.concat([cipher.update(buffer), cipher.final()])
}

/**
 * Descrypts a given buffer
 * @param {buffer} buffer The binary data
 * @param {string} password Used to derive the cipher key and initialization vector (IV). The value must be either a 'latin1' encoded string or a Buffer
 * @param {string} [algorithm='aes-256-ctr'] OpenSSL digest algorithm
 * @see https://nodejs.org/api/crypto.html#crypto_crypto_createdecipher_algorithm_password_options
 */
export const decryptBuffer = (buffer, password, algorithm = DEFAULT_ALGORITHM) => {
  let decipher = crypto.createDecipher(algorithm, password)
  return Buffer.concat([decipher.update(buffer), decipher.final()])
}

/**
 * Encrypts a given text
 * @param {string} text The string to encrupt
 * @param {string} password Used to derive the cipher key and initialization vector (IV). The value must be either a 'latin1' encoded string or a Buffer
 * @param {string} [algorithm='aes-256-ctr'] OpenSSL digest algorithm
 */
export const encryptText = (text, password, algorithm = DEFAULT_ALGORITHM) => {
  let cipher = crypto.createCipher(algorithm, password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

/**
 * Descrypts a given text
 * @param {string} text The string to encrupt
 * @param {string} password Used to derive the cipher key and initialization vector (IV). The value must be either a 'latin1' encoded string or a Buffer
 * @param {string} [algorithm='aes-256-ctr'] OpenSSL digest algorithm
 */
export const decryptText = (text, password, algorithm = DEFAULT_ALGORITHM) => {
  let decipher = crypto.createDecipher(algorithm, password)
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}
