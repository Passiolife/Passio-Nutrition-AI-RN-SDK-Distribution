import React from 'react'
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  View,
  Pressable,
  Linking,
  Modal,
} from 'react-native'
import { useFoodDetail } from './useFoodDetail'
import {
  PassioIconView,
  IconSize,
  PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import { getNutrientName } from '../utils/nutrients'
import { FoodSearchView } from '../search'

interface Props {
  onClose: () => void
  passioFoodItem: PassioFoodItem
}

const FoodDetail = (props: Props) => {
  const { onClose } = props
  const styles = foodDetailStyle()
  const {
    calculatedWeight,
    calculatedWeightUnit,
    selectedServingUnit,
    onServingQuantityChange,
    onServingSizeSelect,
    textInputServingQty,
    foodNutrients,
    showAddIngredients,
    predictNextIngredients,
    onAddIngredients,
    passioFoodItem,
    closeAddIngredients,
    isAddIngredients,
    onReport,
    onSubmitUserCreatedFood,
    onFetchNutrientsFor,
    onFetchTagsFor,
  } = useFoodDetail(props)

  const nutrients = foodNutrients

  const renderNutrientItem = () => (
    <View style={styles.nutrientContainer}>
      <Text style={styles.title}>Nutrients</Text>
      <FlatList
        data={nutrients.filter((item) => item.value >= 1)}
        renderItem={({ item }) => {
          return (
            <View style={styles.nutrientsContainer}>
              <Text style={styles.nutrientTitle}>
                {getNutrientName[item.title] ?? item.title}
              </Text>
              <Text>
                {Math.round(item.value)}
                {' ' + item.unit}
              </Text>
            </View>
          )
        }}
      />
    </View>
  )

  const renderEditServing = () => {
    return (
      <View style={styles.nutrientContainer}>
        <Text style={styles.title}>{`Serving Sizes (${Math.round(
          calculatedWeight ?? 0
        )} ${calculatedWeightUnit})`}</Text>
        <TextInput
          value={textInputServingQty.toString()}
          style={styles.textInput}
          keyboardType="numeric"
          placeholder="Serving Size"
          placeholderTextColor={'gray'}
          onChangeText={onServingQuantityChange}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={passioFoodItem.amount.servingUnits}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onServingSizeSelect(item)}
              style={[
                styles.servingContainer,
                selectedServingUnit === item.unitName &&
                  styles.servingSelectedContainer,
              ]}
            >
              <Text
                style={[
                  styles.servingContainerTitle,
                  selectedServingUnit === item.unitName &&
                    styles.servingSelectedContainerTitle,
                ]}
              >
                {item.unitName}
              </Text>
            </Pressable>
          )}
        />
      </View>
    )
  }

  const renderIngredient = () => {
    return (
      <View style={styles.nutrientContainer}>
        {passioFoodItem.ingredients &&
          passioFoodItem.ingredients.length > 1 && (
            <>
              <Text style={styles.title}>Ingredients</Text>
              <FlatList
                data={passioFoodItem.ingredients}
                keyExtractor={(item, index) => item.toString() + index}
                renderItem={({ item }) => (
                  <View style={styles.ingredientsContainer}>
                    <View style={styles.itemIconContainer}>
                      <PassioIconView
                        style={styles.itemIcon}
                        config={{
                          passioID: item.iconId,
                          iconSize: IconSize.PX360,
                        }}
                      />
                    </View>
                    <View style={styles.ingredientDetailContainer}>
                      <Text style={styles.ingredientTitle}>{item.name}</Text>
                      <Text style={styles.ingredientDetail}>
                        {item.amount?.selectedUnit}{' '}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </>
          )}
        <Pressable
          style={styles.addIngredientsContainer}
          onPress={showAddIngredients}
        >
          <Text style={styles.addIngredients}>Add Ingredients</Text>
        </Pressable>
      </View>
    )
  }

  const renderMacro = () => {
    return (
      <View style={styles.macroContainer}>
        {['Calories', 'Carbs', 'Protein', 'Fat'].map((title) => {
          const nutrient = nutrients.find(
            (item) => item.title.toLowerCase() === title.toLowerCase()
          )
          return (
            <View key={title} style={styles.macroTitleContainer}>
              <Text style={styles.macroTitle}>{title}</Text>
              <Text>{(nutrient?.value ?? 0).toFixed(2)}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  const renderOpenFood = () => {
    const openLink = (url: string) => {
      Linking.openURL(url)
    }

    return (
      <Text style={styles.openFood}>
        This nutrition information provided can be found from{' '}
        <Text
          style={styles.link}
          onPress={() => openLink('https://en.openfoodfacts.org/')}
        >
          Open Food Facts
        </Text>
        , which is made available under the{' '}
        <Text
          style={styles.link}
          onPress={() =>
            openLink('https://opendatacommons.org/licenses/dbcl/1.0/')
          }
        >
          Open Database License
        </Text>
      </Text>
    )
  }

  const renderFoodDetailCard = () => {
    return (
      <View style={styles.itemFoodInfoContainer}>
        <View style={styles.itemFoodInfo}>
          <View style={styles.itemIconContainer}>
            <PassioIconView
              style={styles.itemIcon}
              config={{
                passioID: passioFoodItem.iconId,
                iconSize: IconSize.PX90,
              }}
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.foodName}>{passioFoodItem.name}</Text>
          </View>
        </View>
        {renderMacro()}
        {passioFoodItem.isOpenFood && renderOpenFood()}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.closeButton}>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('../assets/back.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>
        {passioFoodItem && (
          <View style={styles.itemDetailContainer}>
            {renderFoodDetailCard()}
            <View style={styles.line} />
            {renderEditServing()}
            <View style={styles.line} />
            {renderNutrientItem()}
            <View style={styles.line} />

            {renderIngredient()}
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
            <TouchableOpacity onPress={onReport}>
              <Text>Submit Report </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSubmitUserCreatedFood}>
              <Text>SubmitUserCreatedFood </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onFetchNutrientsFor}>
              <Text>onFetchNutrientsFor </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onFetchTagsFor}>
              <Text>onFetchTagsFor </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={predictNextIngredients}>
              <Text>predictNextIngredients </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <Modal visible={isAddIngredients}>
        <FoodSearchView
          onClose={closeAddIngredients}
          onFoodDetail={onAddIngredients}
        />
      </Modal>
    </SafeAreaView>
  )
}

const foodDetailStyle = () =>
  StyleSheet.create({
    addIngredientsContainer: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      marginVertical: 16,
      backgroundColor: 'rgba(242, 245, 251, 1)',
    },
    addIngredients: {
      justifyContent: 'center',
      alignContent: 'center',
      fontSize: 16,
      fontWeight: '600',
      alignSelf: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: 'rgba(242, 245, 251, 1)',
      flex: 1,
    },
    macroTitleContainer: {
      flex: 1,
      marginTop: 12,
    },
    ingredientDetailContainer: {
      alignSelf: 'center',
    },
    flex1: {
      flex: 1,
    },
    link: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
    macroTitle: {
      fontSize: 16,
      fontWeight: '600',
    },
    macroContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    closeButton: {
      margin: 16,
    },
    itemFoodInfo: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    itemFoodInfoContainer: {
      borderRadius: 16,
      backgroundColor: 'white',
      padding: 16,
    },
    foodName: {
      paddingHorizontal: 16,
      fontSize: 16,
      textTransform: 'capitalize',
      fontWeight: '600',
    },
    foodDetail: {
      paddingHorizontal: 16,
    },
    openFood: {
      paddingVertical: 16,
    },
    nutrientContainer: {
      backgroundColor: 'white',
      padding: 16,
    },
    backIcon: {
      height: 24,
      width: 24,
    },
    nutrientsContainer: {
      flexDirection: 'row',
      marginVertical: 4,
    },
    ingredientsContainer: {
      flexDirection: 'row',
      marginVertical: 4,
      padding: 8,
      backgroundColor: 'rgba(238, 242, 255, 1)',
    },
    ingredientTitle: {
      marginHorizontal: 16,
      fontWeight: '500',
      fontSize: 14,
    },
    ingredientDetail: {
      marginHorizontal: 16,
    },
    line: {
      height: 0.5,
      marginVertical: 8,
    },
    title: {
      fontWeight: '500',
      color: 'black',
      fontSize: 16,
      marginBottom: 12,
      flex: 1,
    },
    servingContainerTitle: {
      fontWeight: '400',
      color: 'black',
      fontSize: 13,
      paddingVertical: 6,
      overflow: 'hidden',
      textTransform: 'capitalize',
    },
    nutrientTitle: {
      fontWeight: '400',
      color: 'black',
      textTransform: 'capitalize',
      flex: 1,
    },
    servingContainer: {
      marginHorizontal: 4,
      borderRadius: 12,
      paddingHorizontal: 8,
      backgroundColor: 'rgba(238, 242, 255, 1)',
    },
    servingSelectedContainer: {
      backgroundColor: 'blue',
    },
    servingSelectedContainerTitle: {
      color: 'white',
    },
    itemContainer: {
      padding: 12,
      backgroundColor: 'white',
      marginVertical: 4,
      marginHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemFoodName: {
      flex: 1,
      textTransform: 'capitalize',
      marginHorizontal: 8,
      overflow: 'hidden',
      fontSize: 16,
    },
    itemDetailContainer: {
      padding: 16,
    },
    itemDetail: {
      color: 'white',
    },
    itemIconContainer: {
      overflow: 'hidden',
      height: 60,
      width: 60,
      borderRadius: 30,
    },
    itemIcon: {
      height: 60,
      width: 60,
    },
    textInput: {
      borderColor: 'rgba(209, 213, 219, 1)',
      backgroundColor: 'rgba(238, 242, 255, 1)',
      borderWidth: 1,
      paddingHorizontal: 16,
      borderRadius: 16,
      padding: 16,
      marginVertical: 16,
    },
  })

export default FoodDetail
