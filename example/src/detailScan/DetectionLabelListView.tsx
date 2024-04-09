import {
  PassioFoodItem,
  IconSize,
  PassioIconView,
} from '@passiolife/nutritionai-react-native-sdk-v2'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import React from 'react'

export interface Candidate extends PassioFoodItem {
  alternatives?: string[]
}

interface Props {
  candidates: Candidate[]
  onItemPress: (item: PassioFoodItem) => void
}

export const DetectionLabelListView = (props: Props) => {
  return (
    <View style={styles.container}>
      {props.candidates.map((candidate, i) => (
        <CandidateView
          item={candidate}
          onItemPress={props.onItemPress}
          key={i}
        />
      ))}
    </View>
  )
}

const CandidateView = ({
  item,
  onItemPress,
}: {
  item: Candidate
  onItemPress: (item: PassioFoodItem) => void
}) => {
  const { name, details, iconId } = item
  return (
    <Pressable
      onPress={() => {
        onItemPress(item)
      }}
      key={`${name}`}
      style={styles.candidate}
    >
      <View style={styles.row}>
        {iconId ? (
          <PassioIconView
            style={styles.icon}
            config={{
              passioID: iconId,
              iconSize: IconSize.PX90,
            }}
          />
        ) : null}
        <View>
          <Text style={styles.item}>{name}</Text>
          {details ? <Text style={styles.ingredients}>{details}</Text> : null}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  candidate: {
    backgroundColor: 'rgba(238, 242, 255, 1)',
    padding: 6,
    marginHorizontal: 12,
    marginVertical: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  item: {
    fontSize: 20,
    fontWeight: '400',
    padding: 6,
    textTransform: 'capitalize',
    color: 'black',
  },
  icon: {
    width: 50,
    height: 50,
    overflow: 'hidden',
    borderRadius: 25,
  },
  ingredients: {
    opacity: 0.8,
    marginVertical: 6,
    color: 'black',
  },
})
