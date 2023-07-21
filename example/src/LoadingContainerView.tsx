import React, { useCallback, useState } from 'react'
import { StyleSheet, View, Image, Button, Text } from 'react-native'
import { FoodDectionView } from './FoodDetectionView'
import { SDKStatus, useCameraAuthorization, usePassioSDK } from './App.hooks'
import { FoodDetectionFromImage } from './FoodDetectionFromImage'
import { launchImageLibrary } from 'react-native-image-picker'

export const LoadingContainerView = () => {
  const [isStarted, setIsStarted] = useState(false)
  const [imageUri, setImageUri] = useState('')

  const cameraAuthorized = useCameraAuthorization()

  const sdkStatus = usePassioSDK({
    key: '',
    autoUpdate: true,
  })

  const onStart = useCallback(() => {
    setIsStarted(true)
  }, [])

  const onStop = useCallback(() => {
    setIsStarted(false)
  }, [])

  const onScanImage = useCallback(async () => {
    const { assets } = await launchImageLibrary({ mediaType: 'photo' })
    setImageUri(assets?.[0].uri?.replace('file://', '') ?? '')
  }, [])

  if (isStarted) {
    return <FoodDectionView onStopPressed={onStop} />
  }

  return (
    <LoadingView
      status={sdkStatus.loadingState}
      cameraAuthorized={cameraAuthorized}
      fileLeft={sdkStatus.leftFile}
      onPressStart={onStart}
      imageUri={imageUri}
      onScanImagePress={onScanImage}
    />
  )
}

const logo = require('./assets/passio_logo.png')

const LoadingView = (props: {
  status: SDKStatus
  cameraAuthorized: boolean
  fileLeft: number | null
  onPressStart: () => void
  imageUri: string
  onScanImagePress: () => void
}) => {
  return (
    <View style={styles.container}>
      <Image source={logo} />
      {props.status === 'downloading' ? (
        <Text>{`'Downloading models... `}</Text>
      ) : null}
      {props.status === 'error' ? <Text>{'Error!'}</Text> : null}
      {props.fileLeft !== null && props.fileLeft !== 0 ? (
        <Text>{`Downloading file lefts... ${props.fileLeft}`}</Text>
      ) : null}
      {props.status === 'ready' && props.cameraAuthorized ? (
        <Button title="Start Scanning" onPress={props.onPressStart} />
      ) : null}
      {props.status === 'ready' ? (
        <>
          <View style={styles.space} />
          <Button title="Scan from an Image" onPress={props.onScanImagePress} />
          <FoodDetectionFromImage imageUri={props.imageUri} />
        </>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
  },
  logo: {
    height: 200,
    width: 200,
  },
  space: {
    margin: 10,
  },
})
