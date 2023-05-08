import {
  IconSize,
  PassioIDEntityType,
  PassioIconView,
} from '@passiolife/nutritionai-react-native-sdk-v2'
import { StyleSheet, Text, View } from 'react-native'

import React from 'react'

export interface Candidate {
  name: string
  passioID: string
  entityType: PassioIDEntityType
  foodItem?: {
    ingredientsDescription?: string
  }
}

interface Props {
  candidates: Candidate[]
}

export const DetectionLabelListView = (props: Props) => {
  return (
    <View style={styles.container}>
      {props.candidates.map((candidate, i) => (
        <CandidateView {...candidate} key={i} />
      ))}
    </View>
  )
}

const CandidateView = ({ name, passioID, foodItem, entityType }: Candidate) => {
  return (
    <View key={`${name}`} style={styles.candidate}>
      <View style={styles.row}>
        {passioID ? (
          <PassioIconView
            style={styles.icon}
            config={{
              passioID: passioID,
              iconSize: IconSize.PX90,
              passioIDEntityType: entityType,
            }}
          />
        ) : null}
        <Text style={styles.item}>{name}</Text>
      </View>
      {foodItem?.ingredientsDescription ? (
        <Text style={styles.ingredients}>
          {foodItem.ingredientsDescription}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  candidate: {
    backgroundColor: '#333333',
    padding: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  item: {
    fontSize: 20,
    fontWeight: '400',
    height: '100%',
    padding: 6,
    textTransform: 'capitalize',
    color: 'white',
  },
  icon: {
    width: 50,
    height: 50,
  },
  ingredients: {
    opacity: 0.8,
    color: 'white',
  },
})
