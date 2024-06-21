import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { DetectionCameraView } from '@passiolife/nutritionai-react-native-sdk-v3'

import React from 'react'
import { useQuickNutritionScan } from './useQuickNutritionScan'
import { NutritionFactView } from './view/NutritionFactView'

interface Props {
  onClose: () => void
}

export const NutritionFactScreen = ({ onClose }: Props) => {
  const { loading, nutritionFacts, onClearResultPress } =
    useQuickNutritionScan()
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
      {nutritionFacts && nutritionFacts !== null ? (
        <NutritionFactView
          facts={nutritionFacts}
          onClearResultPress={onClearResultPress}
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
