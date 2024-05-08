import React from 'react'
import { Pressable, StyleSheet, Text, View, Image } from 'react-native'

import {
  IconSize,
  PassioIconView,
  type PassioFoodItem,
  DetectedCandidate,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import { AlternativeFood } from '../../../src/views/AlternativeFood'

export interface QuickFoodResultProps {
  attribute: PassioFoodItem
  alternativeAttributes?: DetectedCandidate[]
  onAlternativeFoodItemChange?: (item: DetectedCandidate) => void
  onClearResultPress?: () => void
  onItemClick?: (passioFoodItem: PassioFoodItem) => void
}

export const QuickFoodResult = ({
  attribute,
  alternativeAttributes,
  onAlternativeFoodItemChange,
  onClearResultPress,
  onItemClick,
}: QuickFoodResultProps) => {
  const styles = quickFoodResultStyle()

  const nutrients =
    PassioSDK.getNutrientsSelectedSizeOfPassioFoodItem(attribute)

  return (
    <Pressable
      onPress={() => {
        onItemClick?.(attribute)
      }}
      style={styles.itemContainer}
    >
      <View style={styles.foodResult}>
        <View style={styles.itemIconContainer}>
          <PassioIconView
            style={styles.itemIcon}
            config={{
              passioID: attribute.iconId ?? attribute.id,
              iconSize: IconSize.PX180,
            }}
          />
        </View>
        <View>
          <Text style={styles.itemFoodName}>{attribute.name}</Text>
          <Text style={styles.itemFoodDetail}>
            {Math.round(attribute.amount?.weight?.value ?? 0) +
              ' ' +
              attribute.amount?.weight?.unit}
          </Text>
          <Text style={styles.itemFoodDetail}>
            {Math.round(nutrients.calories?.value ?? 0) +
              ' ' +
              nutrients?.calories?.unit}
          </Text>
        </View>
      </View>
      {alternativeAttributes && (
        <AlternativeFood
          detectedCandidates={alternativeAttributes}
          onAlternativeFoodItemChange={onAlternativeFoodItemChange}
        />
      )}
      <Pressable style={styles.clearResult} onPress={onClearResultPress}>
        <Image
          source={require('../../assets/close.png')}
          style={styles.close}
        />
      </Pressable>
    </Pressable>
  )
}

const quickFoodResultStyle = () =>
  StyleSheet.create({
    itemContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      padding: 16,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor: 'white',
      minHeight: 150,
      flex: 1,
      marginVertical: 0,
      left: 0,
    },
    foodResult: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    close: {
      width: 24,
      height: 24,
      tintColor: 'white',
    },
    itemFoodName: {
      flex: 1,
      textTransform: 'capitalize',
      paddingHorizontal: 8,
      fontSize: 16,
      fontWeight: '500',
    },
    itemFoodDetail: {
      flex: 1,
      textTransform: 'capitalize',
      marginHorizontal: 8,
      fontSize: 12,
    },
    itemIcon: {
      height: 60,
      width: 60,
    },
    itemIconContainer: {
      height: 60,
      width: 60,
      overflow: 'hidden',
      borderRadius: 30,
    },
    clearResult: {
      flexDirection: 'row',
      backgroundColor: 'red',
      borderRadius: 32,
      alignItems: 'center',
      alignSelf: 'center',
      padding: 8,
      marginVertical: 16,
    },
  })
