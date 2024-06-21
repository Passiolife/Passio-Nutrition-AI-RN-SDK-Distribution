import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native'
import {
  IconSize,
  PassioIconView,
  type PassioAdvisorResponse,
} from '@passiolife/nutritionai-react-native-sdk-v3'

interface Props {
  response: PassioAdvisorResponse
  onClose?: () => void
}

const IngredientsView = ({ response, onClose }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={onClose}>
        <Text>Close</Text>
      </TouchableOpacity>
      <FlatList
        data={response.extractedIngredients}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <PassioIconView
              config={{
                passioID: item.foodDataInfo?.iconID ?? '',
                iconSize: IconSize.PX180,
              }}
              style={styles.icon}
            />
            <Text style={styles.text}>{item.recognisedName}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 16,
    backgroundColor: 'white',
    right: 0,
    minHeight: 200,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  close: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  itemContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  icon: {
    height: 48,
    width: 48,
    marginHorizontal: 16,
  },
  text: {
    textTransform: 'capitalize',
  },
})

export default IngredientsView
