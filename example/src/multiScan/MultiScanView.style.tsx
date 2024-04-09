import type { ViewStyle } from 'react-native'
import { Dimensions, StyleSheet } from 'react-native'

const { height } = Dimensions.get('window')

export const styles = StyleSheet.create({
  closeIconStyle: {
    height: 24,
    width: 24,
  },
  touchAreaStyle: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  scanningLayout: {
    flexDirection: 'row',
  },
  scanningBaseContainerStyleHeight: {
    height: height / 2,
    zIndex: 90,
  },
})

export const bottomSheet = StyleSheet.create({
  mainContainer: {
    height: Dimensions.get('window').height,
  },
  container: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'yellow',
  },
  showBottomSheetStyle: {
    opacity: 1,
  },
  hideBottomSheetStyle: {
    opacity: 0,
  },
  backgroundStyle: {
    backgroundColor: 'red',
  },
})

export const baseStyle: ViewStyle = {}

export const blackBackgroundStyle: ViewStyle = {
  backgroundColor: 'black',
  width: '100%',
  flex: 1,
  flexDirection: 'column',
}

export const cameraStyle: ViewStyle = {
  flex: 1,
}

export const closeActionContainer: ViewStyle = {
  ...baseStyle,
  top: 52,
  height: 25,
  width: 25,
  position: 'absolute',
  left: 20,
}
