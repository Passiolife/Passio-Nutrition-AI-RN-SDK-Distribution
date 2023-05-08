import { Platform } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'

export async function downloadFile(fileName: string): Promise<string> {
  const url = getDownloadURL(fileName)
  console.log(`Downloading ${url}...`)
  const path = RNFetchBlob.fs.dirs.DocumentDir + '/' + fileName
  return RNFetchBlob.config({ path })
    .fetch('GET', url)
    .then((response) => {
      if (response.info().status === 200) {
        console.log(`Downloaded ${fileName}`)
        return response.path()
      } else {
        throw new Error(
          `Unexpected status code for ${fileName}: ${response.info().status}`
        )
      }
    })
    .catch((err) => {
      console.error(`Error downloading ${fileName}: ${err}`)
      throw err
    })
}

function getDownloadURL(fileName: string): string {
  //FIXME: add download base URLs
  if (Platform.OS === 'ios') {
    return '' + fileName
  }
  const components = fileName.split('.')
  const modelVersion = components[components.length - 2]
  return `${modelVersion}/${fileName}`
}
