import { requireNativeComponent, ViewProps, HostComponent } from 'react-native'
/**
 * A component that displays the camera feed and sends camera frames
 * to the food detection models.
 */
export const DetectionCameraView = requireNativeComponent(
  'DetectionCameraView'
) as HostComponent<ViewProps>
