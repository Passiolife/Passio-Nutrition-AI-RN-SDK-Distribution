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
  PassioFoodItem,
  PassioMealPlan,
  PassioMealPlanItem,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import useMealPlan from './useMealPlan'

export interface Props {
  onClose: () => void
  onFoodDetail: (passioFoodItem: PassioFoodItem) => void
}

// FoodSearchScreen component
export const MealPlan = (props: Props) => {
  // Get styles object from the searchStyle function
  const styles = searchStyle()

  // Destructure values from the custom hook
  const {
    passioMealPlanItem,
    passioMealPlans,
    onChangeMeal,
    loading,
    onResultItemPress,
    passioMealPlan,
    generateDaysData,
    onChangeDay,
    selectedDay,
  } = useMealPlan(props)

  // Function to render each item in the FlatList
  const renderSearchItem = ({ item }: { item: PassioMealPlanItem }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onResultItemPress(item.meal)}
      >
        <View style={styles.itemIconContainer}>
          <PassioIconView
            style={styles.itemIcon}
            config={{
              passioID: item.meal.iconID,
              iconSize: IconSize.PX360,
            }}
          />
        </View>
        <View>
          <Text style={styles.itemFoodName}>{item.meal.foodName}</Text>
          <Text style={styles.itemBrandName}>
            {item.meal.nutritionPreview?.servingUnit + ' '}
            {item.meal.nutritionPreview?.servingQuantity + ' | '}
            {Math.round(item.meal.nutritionPreview?.calories ?? 0) + ' kcal'}
            {item.meal.brandName ? ', ' + item.meal.brandName : ''}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
  const renderMealTime = ({ item }: { item: PassioMealPlan }) => {
    return (
      <TouchableOpacity
        style={styles.mealTimeContainer}
        onPress={() => onChangeMeal(item)}
      >
        <Text
          style={[
            styles.mealTime,
            item.mealPlanLabel === passioMealPlan?.mealPlanLabel &&
              styles.selectedMealTime,
          ]}
        >
          {item.mealPlanLabel}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderDays = ({ item, index }: { item: string; index: number }) => {
    return (
      <TouchableOpacity
        style={styles.mealTimeContainer}
        onPress={() => {
          onChangeDay(index)
        }}
      >
        <Text
          style={[
            styles.mealTime,
            index === selectedDay && styles.selectedMealTime,
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
        data={passioMealPlanItem}
        contentContainerStyle={styles.list}
        renderItem={renderSearchItem}
        ListEmptyComponent={renderLoading}
        ListHeaderComponent={() => {
          return (
            <View>
              <FlatList
                data={generateDaysData}
                renderItem={renderDays}
                horizontal
              />
              <FlatList
                data={passioMealPlans}
                renderItem={renderMealTime}
                horizontal
              />
            </View>
          )
        }}
        keyExtractor={(item, index) => item.meal.foodName.toString() + index}
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
