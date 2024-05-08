import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  DetectionCameraView,
  PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3'

import { useQuickScan } from './useQuickScan'
import React from 'react'
import { QuickFoodResult } from './view/QuickFoodResult'

interface Props {
  onClose: () => void
  onFoodDetail: (passioFoodItem: PassioFoodItem) => void
}

export const QuickScanningScreen = ({ onClose, onFoodDetail }: Props) => {
  const {
    loading,
    passioFoodItem,
    onClearResultPress,
    alternative,
    onAlternativeFoodItemChange,
  } = useQuickScan()
  const styles = quickScanStyle()

  return (
    <View style={styles.blackBackgroundStyle}>
      <DetectionCameraView style={styles.detectionCamera} />
      {loading ? (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator />
          <Text>Scanning...</Text>
        </View>
      ) : null}
      {passioFoodItem !== null ? (
        <QuickFoodResult
          attribute={passioFoodItem}
          onAlternativeFoodItemChange={onAlternativeFoodItemChange}
          onClearResultPress={onClearResultPress}
          alternativeAttributes={alternative ?? []}
          onItemClick={onFoodDetail}
        />
      ) : null}
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.text}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const quickScanStyle = () =>
  StyleSheet.create({
    detectionCamera: {
      flex: 1,
      width: '100%',
    },
    blackBackgroundStyle: {
      backgroundColor: 'black',
      width: '100%',
      flex: 1,
      flexDirection: 'column',
    },
    loadingIndicator: {
      backgroundColor: 'white',
      minHeight: 150,
      borderTopRightRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: 24,
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
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
