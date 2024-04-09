import {
  requireNativeComponent,
  type ViewProps,
  type HostComponent,
} from 'react-native'
import type { IconSize, PassioID } from '../models'

type Props = {
  config: {
    passioID: PassioID
    iconSize: IconSize
  }
} & ViewProps

/**
 * A component for displaying food icons from the Passio SDK.
 */
export const PassioIconView = requireNativeComponent(
  'PassioIconView'
) as HostComponent<Props>
