import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

import {
  DetectedCandidate,
  IconSize,
  PassioFoodItem,
  PassioIconView,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import { AlternativeFood } from '../../views/AlternativeFood'

export interface MultiScanResultItemProps {
  attribute: DetectedCandidate
  onClearResultPress?: (item: DetectedCandidate) => void
  onFoodDetail: (item: PassioFoodItem) => void
}

export const MultiScanResultItem = ({
  attribute,
  onClearResultPress,
  onFoodDetail,
}: MultiScanResultItemProps) => {
  const styles = quickScanStyle()

  const onAlternativeFoodItemChange = () => {}

  return (
    <Pressable
      onPress={async () => {
        const result = await PassioSDK.fetchFoodItemForPassioID(
          attribute.passioID
        )
        if (result) {
          onFoodDetail(result)
        }
      }}
      style={styles.itemContainer}
    >
      <View style={styles.foodResult}>
        <View style={styles.imageContainer}>
          <PassioIconView
            style={styles.itemIcon}
            config={{
              passioID: attribute.passioID,
              iconSize: IconSize.PX180,
            }}
          />
        </View>
        <Text style={styles.itemFoodName}>{attribute.foodName}</Text>
      </View>
      <AlternativeFood
        onAlternativeFoodItemChange={onAlternativeFoodItemChange}
        detectedCandidates={attribute.alternatives ?? []}
      />
      <Pressable
        style={styles.clearResult}
        onPress={() => onClearResultPress?.(attribute)}
      >
        <Image
          style={styles.close}
          source={require('../../assets/close.png')}
        />
      </Pressable>
    </Pressable>
  )
}

const quickScanStyle = () =>
  StyleSheet.create({
    itemContainer: {
      padding: 12,
      marginHorizontal: 16,
      backgroundColor: 'rgba(238, 242, 255, 1)',
      marginTop: 16,
      left: 0,
    },
    imageContainer: {
      borderRadius: 50,
      overflow: 'hidden',
      height: 50,
      width: 50,
    },
    close: {
      height: 16,
      width: 16,
      tintColor: 'white',
    },
    foodResult: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemFoodName: {
      flex: 1,
      textTransform: 'capitalize',
      fontWeight: '400',
      marginHorizontal: 8,
      fontSize: 16,
    },
    itemIcon: {
      height: 50,
      width: 50,
      overflow: 'hidden',
      borderRadius: 30,
    },
    clearResult: {
      position: 'absolute',
      top: -9,
      backgroundColor: 'red',
      overflow: 'hidden',
      padding: 8,
      justifyContent: 'center',
      borderRadius: 30,
      alignItems: 'center',
      right: 0,
    },
    clearResultItem: {
      height: 8,
      width: 8,
    },
  })
