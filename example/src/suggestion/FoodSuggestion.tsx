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
} from 'react-native'
import {
  PassioIconView,
  IconSize,
  PassioFoodDataInfo,
  PassioFoodItem,
  PassioMealTime,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import useSuggestions from './useSuggestion'

export interface Props {
  onClose: () => void
  onFoodDetail: (passioFoodItem: PassioFoodItem) => void
}

export const FoodSuggestion = (props: Props) => {
  const styles = suggestionStyle()

  // Destructure values from the custom hook
  const {
    foodResults,
    loading,
    onResultItemPress,
    mealTime,
    onChangeMeal,
    mealTimes,
  } = useSuggestions(props)

  // Function to render each item in the FlatList
  const renderSuggestionItem = ({ item }: { item: PassioFoodDataInfo }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onResultItemPress(item)}
      >
        <View style={styles.itemIconContainer}>
          <PassioIconView
            style={styles.itemIcon}
            config={{
              passioID: item.iconID,
              iconSize: IconSize.PX360,
            }}
          />
        </View>
        <View>
          <Text style={styles.itemFoodName}>{item.foodName}</Text>
          <Text style={styles.itemBrandName}>
            {Math.round(item.nutritionPreview?.calories ?? 0) + ' kcal'}
            {item.brandName ? ', ' + item.brandName : ''}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
  const renderMealTime = ({ item }: { item: PassioMealTime }) => {
    return (
      <TouchableOpacity
        style={styles.mealTimeContainer}
        onPress={() => onChangeMeal(item)}
      >
        <Text
          style={[
            styles.mealTime,
            item === mealTime && styles.selectedMealTime,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    )
  }

  // Display loading indicator when results are empty and loading is true
  const renderLoading = () => {
    return (
      <>{loading ? <ActivityIndicator style={{ marginTop: 100 }} /> : null}</>
    )
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

      <FlatList
        data={foodResults}
        contentContainerStyle={styles.list}
        renderItem={renderSuggestionItem}
        ListEmptyComponent={renderLoading}
        ListHeaderComponent={() => {
          return (
            <FlatList data={mealTimes} renderItem={renderMealTime} horizontal />
          )
        }}
        keyExtractor={(item, index) => item.iconID.toString() + index}
      />
    </SafeAreaView>
  )
}

// Styles for the component
const suggestionStyle = () =>
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
    mealTimeContainer: {
      marginStart: 16,
      backgroundColor: 'white',
      flexDirection: 'row',
      borderRadius: 24,
      marginBottom: 16,
      overflow: 'hidden',
    },
    mealTime: {
      textTransform: 'capitalize',
      paddingVertical: 12,
      paddingHorizontal: 12,
      fontSize: 16,
    },
    itemFoodName: {
      flex: 1,
      textTransform: 'capitalize',
      marginHorizontal: 8,
      fontSize: 16,
    },

    selectedMealTime: {
      color: 'white',
      backgroundColor: 'blue',
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
