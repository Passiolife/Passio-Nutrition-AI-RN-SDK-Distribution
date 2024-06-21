import React from 'react'
import { Pressable, StyleSheet, Text, View, Image } from 'react-native'

import type { NutritionFacts } from '@passiolife/nutritionai-react-native-sdk-v3'

export interface NutritionFactViewProps {
  facts: NutritionFacts
  onClearResultPress?: () => void
}

export const NutritionFactView = ({
  facts,
  onClearResultPress,
}: NutritionFactViewProps) => {
  const styles = quickFoodResultStyle()

  return (
    <Pressable onPress={() => {}} style={styles.itemContainer}>
      <View style={styles.foodResult}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.itemFoodName}>
            {facts.calories + '\n' + 'cal'}
          </Text>
          <Text style={styles.itemFoodName}>
            {facts.carbs + '\n' + 'carbs'}
          </Text>
          <Text style={styles.itemFoodName}>
            {facts.protein + '\n' + 'protein'}
          </Text>
          <Text style={styles.itemFoodName}>{facts.fat + '\n' + 'fat'}</Text>
        </View>
      </View>

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
      textAlign: 'center',
      fontWeight: '500',
    },
    itemIcon: {
      height: 60,
      width: 60,
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
