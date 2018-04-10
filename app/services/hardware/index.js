import { ipcRenderer, ipcMain } from 'electron'

import Transport from '@ledgerhq/hw-transport-node-hid'
import Str from '@ledgerhq/hw-app-str'

export const getLedgerStellarKey = () => {
  return ipcRenderer.send('getLedgerStellarKey', '')
  /*ipcRenderer.on('getLedgerStellarKey-reply', (event, arg) => {
    console.log('IPCRenderer || getLedgerStellarKey-reply')
    console.log(args)
    key = args
  })
  return key*/
}

export const ledgerStellarKeyRequest = () => {
  ipcMain.on('getLedgerStellarKey', async (event, arg) => {
    console.log('IPCMain || getLedgerStellarKey')
    const key = await stellarAppVersion()
    event.sender.send('getLedgerStellarKey-reply', key)
  })
}

const stellarAppVersion = async () => {
  const transport = await Transport.create()
  const str = new Str(transport)
  const result = await str.getAppConfiguration()
  return result.version
}

const stellarPublicKey = async () => {
  const transport = await Transport.create()
  const str = new Str(transport)
  const result = await str.getPublicKey("44'/148'/0'")
  return result.publicKey
}

const signStellarTransaction = async () => {
  const transaction = {}
  const transport = await Transport.create()
  const str = new Str(transport)
  const result = await str.signTransaction("44'/148'/0'", transaction.signatureBase())

  // add signature to transaction
  const keyPair = StellarSdk.Keypair.fromPublicKey(publicKey)
  const hint = keyPair.signatureHint()
  const decorated = new StellarSdk.xdr.DecoratedSignature({hint: hint, signature: signature})
  transaction.signatures.push(decorated)

  return transaction;
}