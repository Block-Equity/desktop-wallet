import { StellarWallet } from '../security/wallet'
import { generate as generateMnemonic } from '../security/mnemonic'

export const getMnemonic = () => {
  const mnemonic = generateMnemonic()
  console.log('Mnemonic', mnemonic)

  return {
    mnemonic
  }
}

export const createWallet = (mnemonic, passphrase, index) => {
  const wallet = StellarWallet.createFromMnemonic(mnemonic, passphrase)
  console.log(`Stellar Wallet Creation || ${JSON.stringify(wallet)}`)

  const publicKey = wallet.getPublicKey(index)
  const secretKey = wallet.getSecret(index)

  console.log(`Secret: ${secretKey} || Public: ${publicKey}`)
  return {
    mnemonic,
    publicKey,
    secretKey
  }
}











