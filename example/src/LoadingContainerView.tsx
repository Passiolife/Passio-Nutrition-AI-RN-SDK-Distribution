import React, { useCallback, useState } from 'react'
import { StyleSheet, View, Image, Button, Text } from 'react-native'
import { FoodDectionView } from './FoodDetectionView'
import { SDKStatus, useCameraAuthorization, usePassioSDK } from './App.hooks'

export const LoadingContainerView = () => {
  const [isStarted, setIsStarted] = useState(false)

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

  if (isStarted) {
    return <FoodDectionView onStopPressed={onStop} />
  }

  return (
    <LoadingView
      status={sdkStatus.loadingState}
      cameraAuthorized={cameraAuthorized}
      fileLeft={sdkStatus.leftFile}
      onPressStart={onStart}
    />
  )
}

const logo = require('./assets/passio_logo.png')

const LoadingView = (props: {
  status: SDKStatus
  cameraAuthorized: boolean
  fileLeft: number | null
  onPressStart: () => void
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
})
