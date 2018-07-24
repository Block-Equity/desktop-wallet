import axios from 'axios'
const exchangeListURL = 'https://api-staging.blockeq.com/directory/exchanges'

export const getSupportedAssets = () => {
  const url = 'https://blockeq-wallet.firebaseio.com/supported_assets.json'
  return new Promise((resolve, reject) => {
    axios.get(url)
    .then( response => {
      var obj = response.data
      var array = Object.keys(obj).map(item => obj[item]);
      resolve({
        list: array,
        response: obj
      })
    })
    .catch( error => {
      reject({error})
      console.log(error)
    })
  })
}

export const getExchangeDirectory = () => {
  const url = exchangeListURL
  console.log(`API call made`)
  return new Promise((resolve, reject) => {
    axios.get(url)
    .then( response => {
      var obj = response.data
      var array = Object.keys(obj).map(item => obj[item]);
      resolve({
        list: array,
        response: obj
      })
    })
    .catch( error => {
      reject({error})
      console.log(error)
    })
  })
}