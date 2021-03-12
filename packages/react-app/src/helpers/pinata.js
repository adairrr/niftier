import fetch from 'isomorphic-fetch'
import FormData from 'form-data'

export function upload({ file }) {
  const url = `${process.env.REACT_APP_PINATA_API_URL}/pinning/pinFileToIPFS`

  let data = new FormData()
  data.append('file', file)

  const metadata = JSON.stringify({
    name: file.path,
    keyvalues: {},
  })

  data.append('pinataMetadata', metadata)

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  })

  data.append('pinataOptions', pinataOptions)

  return fetch(url, {
    headers: {
      pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
      pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
    },
    method: 'POST',
    body: data,
  })
}
