import React from 'react'
import {
  requireNativeComponent,
  type ViewProps,
  type HostComponent,
  Platform,
} from 'react-native'

// Define the props for the native component
type NativeProps = {
  config?: {
    volumeDetectionMode?: 'auto' | 'dualWideCamera' | 'none'
  }
} & ViewProps

// Require the native component
const NativeDetectionCameraView = requireNativeComponent(
  'DetectionCameraView'
) as HostComponent<NativeProps>

// Create a wrapper component

type Props = {
  volumeDetectionMode?: 'auto' | 'dualWideCamera' | 'none'
} & ViewProps

export const DetectionCameraView = ({
  volumeDetectionMode = 'auto',
  ...rest
}: Props) => {
  if (Platform.OS === 'ios') {
    return (
      <NativeDetectionCameraView
        {...rest}
        config={{
          volumeDetectionMode: volumeDetectionMode,
        }}
      />
    )
  } else {
    return <NativeDetectionCameraView {...rest} />
  }
}
