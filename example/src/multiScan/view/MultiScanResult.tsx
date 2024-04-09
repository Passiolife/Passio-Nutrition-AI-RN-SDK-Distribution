import { StyleSheet } from 'react-native'

import React from 'react'
import { MultiScanResultItem } from './MultiScanResultItem'
import type {
  DetectedCandidate,
  PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v2'
import { BottomSheetFlatList } from '@gorhom/bottom-sheet'

export interface MultiScanResultProps {
  attributes: DetectedCandidate[]
  onClearResultPress: (item: DetectedCandidate) => void
  onFoodDetail: (item: PassioFoodItem) => void
}

export const MultiScanResult = ({
  attributes,
  onClearResultPress,
  onFoodDetail,
}: MultiScanResultProps) => {
  const styles = multiScanResultStyle()

  const renderItem = ({ item }: { item: DetectedCandidate }) => {
    return (
      <MultiScanResultItem
        attribute={item}
        onClearResultPress={onClearResultPress}
        onFoodDetail={onFoodDetail}
      />
    )
  }

  return (
    <BottomSheetFlatList
      contentContainerStyle={styles.flatList}
      data={attributes}
      renderItem={renderItem}
      keyExtractor={(item) => item.passioID}
      extraData={attributes}
    />
  )
}

const multiScanResultStyle = () =>
  StyleSheet.create({
    flatList: {
      marginVertical: 8,
      paddingBottom: 250,
    },
  })
