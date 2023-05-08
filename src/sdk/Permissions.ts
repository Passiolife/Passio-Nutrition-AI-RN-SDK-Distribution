import { PermissionsAndroid } from 'react-native'

export async function requestAndroidCameraPermission(): Promise<boolean> {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Food Recognition Camera Permission',
        message: 'Grant access to your camera for real-time food recognition.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  } catch (err) {
    console.warn(`Error getting camera permission: ${err}`)
    return Promise.reject(err)
  }
}
