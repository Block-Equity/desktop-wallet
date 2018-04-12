import axios from 'axios'

export const getSupportedAssets = () => {
  const url = 'https://blockeq-wallet.firebaseio.com/supported_assets.json'
  return new Promise((resolve, reject) => {
    axios.get(url)
    .then( response => {
      resolve(response)
      console.log(response)
    })
    .catch( error => {
      reject(error)
      console.log(error)
    })
  })
}