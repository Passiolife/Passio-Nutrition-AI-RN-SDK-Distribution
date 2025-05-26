import React from 'react'
import {
  requireNativeComponent,
  type ViewProps,
  type HostComponent,
  Platform,
} from 'react-native'

// Define the props for the native component
type NativeProps = {} & ViewProps

// Require the native component
const NativeDetectionCameraView = requireNativeComponent(
  'DetectionCameraView'
) as HostComponent<NativeProps>

// Create a wrapper component

type Props = ViewProps

export const DetectionCameraView = ({ ...rest }: Props) => {
  if (Platform.OS === 'ios') {
    return <NativeDetectionCameraView {...rest} />
  } else {
    return <NativeDetectionCameraView {...rest} />
  }
}
