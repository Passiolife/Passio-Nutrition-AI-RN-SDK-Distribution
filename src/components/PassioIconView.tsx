import { requireNativeComponent, ViewProps, HostComponent } from 'react-native'
import type { PassioIDEntityType, IconSize, PassioID } from 'src/models'

type Props = {
  config: {
    passioID: PassioID
    iconSize: IconSize
    passioIDEntityType: PassioIDEntityType
  }
} & ViewProps

/**
 * A component for displaying food icons from the Passio SDK.
 */
export const PassioIconView = requireNativeComponent(
  'PassioIconView'
) as HostComponent<Props>
