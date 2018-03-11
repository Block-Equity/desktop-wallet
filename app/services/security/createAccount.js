import { StellarWallet } from '../security/wallet'
import { generate as generateMnemonic } from '../security/mnemonic'

export const getMnemonic = () => {
  const mnemonic = generateMnemonic()
  const mnemonicArray = mnemonic.split(' ')
  var mnemonicModel = []
  for (var i = 0; i < mnemonicArray.length; i++) {
    var obj = {key: i, label: mnemonicArray[i], numeric: getGetOrdinal(i + 1)}
    mnemonicModel.push(obj)
  }

  return {
    mnemonicModel
  }
}

const getGetOrdinal = (n) => {
  var s=["th","st","nd","rd"],
  v=n%100;
  return n+(s[(v-20)%10]||s[v]||s[0]);
}

export const createWallet = (mnemonic, passphrase, index) => {
  const wallet = StellarWallet.createFromMnemonic(mnemonic, passphrase)
  console.log(`Stellar Wallet Creation || ${JSON.stringify(wallet)}`)

  const publicKey = wallet.getPublicKey(index)
  const secretKey = wallet.getSecret(index)

  console.log(`Secret: ${secretKey} || Public: ${publicKey}`)
  return {
    publicKey,
    secretKey
  }
}










