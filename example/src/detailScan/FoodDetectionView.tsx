import {
  BarcodeCandidate,
  BarcodeScanEvent,
  DetectionCameraView,
  PassioFoodItem,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3'

import { Candidate, DetectionLabelListView } from './DetectionLabelListView'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type State = {
  candidates: Candidate[]
}

type Props = {
  onStopPressed: () => void
  onItemPress: (item: PassioFoodItem) => void
}

const attributeLogging = false

export const FoodDetectionView = (props: Props) => {
  const [state, setState] = useState<State>({ candidates: [] })

  useEffect(() => {
    const subscription = PassioSDK.startBarcodeScanning(
      async (detection: BarcodeScanEvent) => {
        const barcodeCandidates = detection.barcodeCandidates
        if (barcodeCandidates?.length) {
          const attributes = await getAttributesForBarcodeCandidates(
            barcodeCandidates
          )
          setState({ candidates: attributes })
        } else {
          setState({ candidates: [] })
        }
      }
    )
    return () => subscription.remove()
  }, [])

  return (
    <View style={styles.container}>
      <DetectionCameraView style={styles.camera} />
      <View style={styles.labelOverlay}>
        <DetectionLabelListView
          candidates={state.candidates}
          onItemPress={props.onItemPress}
        />
      </View>
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={props.onStopPressed}>
          <Text style={styles.text}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(238, 242, 255, 1)',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  camera: {
    flex: 1,
  },
  text: {
    color: 'white',
    fontSize: 30,
  },
  labelOverlay: {
    position: 'absolute',
    paddingBottom: 50,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 45,
    right: 25,
    color: 'white',
  },
})

async function getAttributesForBarcodeCandidates(
  candidates: BarcodeCandidate[]
): Promise<PassioFoodItem[]> {
  const getAttributes = candidates.map(({ barcode }) => {
    return PassioSDK.fetchFoodItemForProductCode(barcode).then(
      (attr: PassioFoodItem | null) => {
        attributeLogging &&
          console.log('Got barcode attributes ', JSON.stringify(attr, null, 2))
        return attr
      }
    )
  })
  const attrs = await Promise.all(getAttributes)
  return attrs.filter(notEmpty)
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}
