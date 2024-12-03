import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  View,
} from 'react-native'
import {
  PassioIconView,
  IconSize,
  PassioFoodDataInfo,
  PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import useFoodSearch from './useSearch'

export interface Props {
  onClose: () => void
  onFoodDetail: (passioFoodItem: PassioFoodItem) => void
}

// FoodSearchScreen component
export const FoodSearchView = (props: Props) => {
  // Get styles object from the searchStyle function
  const styles = searchStyle()

  // Destructure values from the custom hook
  const {
    searchQuery,
    onSearchFood,
    foodResults,
    loading,
    alternatives,
    onSearchResultItemPress,
  } = useFoodSearch(props)

  // Function to render each item in the FlatList
  const renderSearchItem = ({ item }: { item: PassioFoodDataInfo }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onSearchResultItemPress(item)}
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
            {'calories ' +
              Math.round(item.nutritionPreview?.calories ?? 0) +
              ' kcal | '}
            <Text style={styles.itemBrandName}>
              {'fat ' + Math.round(item.nutritionPreview?.fat ?? 0)}
            </Text>
            <Text style={styles.itemBrandName}>
              {' | protein ' + item.nutritionPreview?.protein.toFixed(2)}
            </Text>
          </Text>

          <Text style={styles.itemBrandName}>
            {'carbs ' + item.nutritionPreview?.carbs.toFixed(2)}
          </Text>

          <Text style={styles.itemBrandName}>
            {'fiber ' + item.nutritionPreview?.fiber.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderAlternativeItem = ({ item }: { item: string }) => {
    return (
      <Pressable
        style={styles.alternativeContainer}
        onPress={() => onSearchFood(item)}
      >
        <Text style={styles.itemAlternativeName}>{item}</Text>
      </Pressable>
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
      {/* Search input */}
      <TextInput
        value={searchQuery}
        style={styles.textInput}
        placeholder={'Type in food name'}
        placeholderTextColor={'gray'}
        onChangeText={onSearchFood}
      />

      <FlatList
        data={foodResults}
        contentContainerStyle={styles.list}
        renderItem={renderSearchItem}
        ListEmptyComponent={renderLoading}
        ListHeaderComponent={() => (
          <FlatList
            data={alternatives}
            contentContainerStyle={styles.itemAlternativeContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderAlternativeItem}
            keyExtractor={(item, index) => item.toString() + index}
          />
        )}
        keyExtractor={(item, index) => item.iconID.toString() + index}
      />
    </SafeAreaView>
  )
}

// Styles for the component
const searchStyle = () =>
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
