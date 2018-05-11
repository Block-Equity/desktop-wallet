import axios from 'axios'

export const getStellarMarketInfo = () => {
  const url = 'https://api.coinmarketcap.com/v2/ticker/512/?convert=CAD'
  return new Promise((resolve, reject) => {
    axios.get(url)
    .then( response => {
      var info = response.data.data
      console.log(`Stellar CAD Price: ${JSON.stringify(info)}`)
      resolve({
        info
      })
    })
    .catch( error => {
      reject({error})
      console.log(error)
    })
  })
}