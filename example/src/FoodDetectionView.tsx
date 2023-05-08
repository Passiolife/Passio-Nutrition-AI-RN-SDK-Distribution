import {
  BarcodeCandidate,
  DetectedCandidate,
  DetectionCameraView,
  FoodDetectionConfig,
  FoodDetectionEvent,
  PackagedFoodCode,
  PassioIDAttributes,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v2'
import { Candidate, DetectionLabelListView } from './DetectionLabelListView'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type State = {
  candidates: Candidate[]
}

type Props = { onStopPressed: () => void }

const eventLogging = false
const attributeLogging = false

export const FoodDectionView = (props: Props) => {
  const [state, setState] = useState<State>({ candidates: [] })

  useEffect(() => {
    const config: FoodDetectionConfig = {
      detectBarcodes: true,
      detectPackagedFood: true,
      detectNutritionFacts: true,
    }
    const subscription = PassioSDK.startFoodDetection(
      config,
      async (detection: FoodDetectionEvent) => {
        if (eventLogging) {
          console.log(
            'Food detection event: \n',
            JSON.stringify(detection, null, 2)
          )
        }
        const { candidates, nutritionFacts } = detection
        if (candidates?.barcodeCandidates?.length) {
          const attributes = await getAttributesForBarcodeCandidates(
            candidates.barcodeCandidates
          )
          setState({ candidates: attributes })
        } else if (candidates?.packagedFoodCode?.length) {
          const attributes = await getAttributesForPackagedFoodCandidates(
            candidates.packagedFoodCode
          )
          setState({ candidates: attributes })
        } else if (candidates?.detectedCandidates?.length) {
          const attributes = await getAttributesFromVisualCandidates(
            candidates.detectedCandidates
          )
          setState({
            candidates: attributes,
          })
        } else if (nutritionFacts) {
          console.log(nutritionFacts)
          //TODO UI for nutrition facts
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
        <DetectionLabelListView candidates={state.candidates} />
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
    backgroundColor: 'black',
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

async function getAttributesFromVisualCandidates(
  candidates: DetectedCandidate[]
): Promise<PassioIDAttributes[]> {
  const getAttributes = candidates.map(({ passioID }) => {
    return PassioSDK.getAttributesForPassioID(passioID).then(
      (attr: PassioIDAttributes | null) => {
        attributeLogging &&
          console.log(
            'Got visual candidate attributes ',
            JSON.stringify(attr, null, 2)
          )
        return attr
      }
    )
  })
  const attrs = await Promise.all(getAttributes)
  return attrs.filter(notEmpty)
}

async function getAttributesForBarcodeCandidates(
  candidates: BarcodeCandidate[]
): Promise<PassioIDAttributes[]> {
  const getAttributes = candidates.map(({ barcode }) => {
    return PassioSDK.fetchAttributesForBarcode(barcode).then(
      (attr: PassioIDAttributes | null) => {
        attributeLogging &&
          console.log('Got barcode attributes ', JSON.stringify(attr, null, 2))
        return attr
      }
    )
  })
  const attrs = await Promise.all(getAttributes)
  return attrs.filter(notEmpty)
}

async function getAttributesForPackagedFoodCandidates(
  candidates: PackagedFoodCode[]
): Promise<PassioIDAttributes[]> {
  const getAttributes = candidates.map((packagedFoodCode) => {
    return PassioSDK.fetchPassioIDAttributesForPackagedFood(
      packagedFoodCode
    ).then((attr: PassioIDAttributes | null) => {
      attributeLogging &&
        console.log('Got OCR attributes ', JSON.stringify(attr, null, 2))
      return attr
    })
  })
  const attrs = await Promise.all(getAttributes)
  return attrs.filter(notEmpty)
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}
