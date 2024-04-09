import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import {
  DetectionCameraView,
  PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v2'
import React, { useMemo, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useMultiScanning } from './useMultiScanning'
import { MultiScanResult } from './view/MultiScanResult'

export interface Props {
  onClose: () => void
  onFoodDetail: (item: PassioFoodItem) => void
}

export const MultiScanView = ({ onClose, onFoodDetail }: Props) => {
  const { isLoading, detectedCandidates, onDeleteFoodItem } = useMultiScanning()

  const bottomSheetModalRef = useRef<BottomSheet>(null)

  const snapPoints = useMemo(() => ['20%', '75%'], [])

  return (
    <GestureHandlerRootView style={styles.container}>
      <DetectionCameraView style={styles.camera} />
      <BottomSheet
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={styles.bottomSheetContainer}
        enableContentPanningGesture={
          isLoading || detectedCandidates.length <= 3
        }
      >
        {detectedCandidates.length === 0 ? (
          <ActivityIndicator style={styles.loading} />
        ) : (
          <View style={styles.bottomSheetContainer}>
            <MultiScanResult
              attributes={detectedCandidates}
              onClearResultPress={onDeleteFoodItem}
              onFoodDetail={onFoodDetail}
            />
          </View>
        )}
      </BottomSheet>
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.text}>✕</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  camera: {
    flex: 1,
  },
  loading: {
    marginTop: 45,
  },
  close: {
    color: 'white',
    fontSize: 30,
  },
  bottomSheetContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  text: {
    color: 'white',
    fontSize: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 45,
    right: 25,
    zIndex: 1000,
    color: 'white',
  },
})
