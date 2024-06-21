import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  TextInput,
} from 'react-native'
import {
  PassioIconView,
  IconSize,
  PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import useLegacyAPITest from './useLegacyAPI'

export interface Props {
  onClose: () => void
  onFoodDetail: (passioFoodItem: PassioFoodItem) => void
}

// FoodSearchScreen component
export const LegacyAPITest = (props: Props) => {
  // Get styles object from the searchStyle function
  const styles = componentStyle()

  // Destructure values from the custom hook
  const { loading, passioFoodItem, searchQuery, onSpeechRecognition } =
    useLegacyAPITest(props)

  // Function to render each item in the FlatList
  const renderItem = ({ item }: { item: PassioFoodItem }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={async () => {
          props.onFoodDetail(item)
        }}
      >
        <View style={styles.itemIconContainer}>
          <PassioIconView
            style={styles.itemIcon}
            config={{
              passioID: item.iconId ?? '',
              iconSize: IconSize.PX360,
            }}
          />
        </View>
        <View>
          <Text style={styles.itemFoodName}>{item.name}</Text>
          <Text style={styles.itemFoodName}>
            {item.amount?.selectedQuantity + ' |  ' + item.amount.selectedUnit}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  // Display loading indicator when results are empty and loading is true
  const renderLoading = () => {
    return <>{loading ? <ActivityIndicator /> : null}</>
  }

  // Render the component
  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.closeButton}>
        <TouchableOpacity onPress={props.onClose}>
          <Image
            style={styles.closeText}
            source={require('../assets/back.png')}
          />
        </TouchableOpacity>
      </View>
      <TextInput
        value={searchQuery}
        style={styles.textInput}
        placeholder={'Enter passio ID'}
        placeholderTextColor={'gray'}
        onChangeText={onSpeechRecognition}
      />

      <FlatList
        data={passioFoodItem}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        ListEmptyComponent={renderLoading}
        keyExtractor={(index) => 'item.advisorInfo?.foodDataInfo' + index}
      />
    </SafeAreaView>
  )
}

// Styles for the component
const componentStyle = () =>
  StyleSheet.create({
    closeButton: {},
    list: {
      marginTop: 16,
    },
    closeText: {
      margin: 16,
      height: 24,
      width: 24,
    },
    itemContainer: {
      padding: 12,
      flex: 1,
      marginVertical: 4,
      marginHorizontal: 16,
      backgroundColor: 'white',
      flexDirection: 'row',
      borderRadius: 24,
    },
    itemFoodName: {
      flex: 1,
      textTransform: 'capitalize',
      marginHorizontal: 8,
      fontSize: 16,
    },
    itemBrandName: {
      flex: 1,
      textTransform: 'capitalize',
      marginHorizontal: 8,
      fontSize: 12,
    },

    itemAlternativeContainer: {
      overflow: 'hidden',
    },
    alternativeContainer: {
      marginStart: 16,
      alignItems: 'center',
      overflow: 'hidden',
      alignSelf: 'center',
      backgroundColor: 'rgba(238, 242, 255, 1)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0.1 },
      shadowOpacity: 0.5,
      shadowRadius: 0.5,
      marginVertical: 2,
      marginBottom: 14,
      elevation: 5,
      borderRadius: 24,
    },
    itemAlternativeName: {
      textTransform: 'capitalize',
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    itemIconContainer: {
      height: 46,
      width: 46,
      borderRadius: 30,
      overflow: 'hidden',
    },
    itemIcon: {
      height: 46,
      width: 46,
    },
    textInput: {
      backgroundColor: 'white',
      paddingHorizontal: 16,
      padding: 12,
      color: 'black',
      fontWeight: '500',
      fontSize: 16,
      marginHorizontal: 16,
    },
    body: {
      backgroundColor: 'rgba(242, 245, 251, 1)',
      flex: 1,
    },
  })
