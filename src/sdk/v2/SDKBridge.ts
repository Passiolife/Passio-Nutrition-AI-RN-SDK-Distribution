import { PassioSDK as PassioSDK_V3 } from '../SDKBridge'
import type { PassioIDAttributes } from '../../models/v2'
import type {
  PassioID,
  Barcode,
  PackagedFoodCode,
  FoodSearchResult,
} from '../../models'
import { NativeModules, Platform } from 'react-native'
import type { PassioSDKInterface } from './PassioSDKInterface'
import { convertPassioFoodItemV3ToPassioIdAttributes } from '../../helper'

const { PassioSDKBridge } = NativeModules

export const PassioSDK: PassioSDKInterface = {
  ...PassioSDK_V3,
  async getAttributesForPassioID(
    passioID: PassioID
  ): Promise<PassioIDAttributes | null> {
    const result = await PassioSDKBridge.getAttributesForPassioID(passioID)
    return convertPassioFoodItemV3ToPassioIdAttributes(result)
  },

  async fetchAttributesForBarcode(
    barcode: Barcode
  ): Promise<PassioIDAttributes | null> {
    const result = await PassioSDKBridge.fetchAttributesForBarcode(barcode)
    return convertPassioFoodItemV3ToPassioIdAttributes(result)
  },

  async fetchPassioIDAttributesForPackagedFood(
    packagedFoodCode: PackagedFoodCode
  ): Promise<PassioIDAttributes | null> {
    const result = await PassioSDKBridge.fetchPassioIDAttributesForPackagedFood(
      packagedFoodCode
    )
    return convertPassioFoodItemV3ToPassioIdAttributes(result)
  },

  async fetchSearchResult(
    queryResult: FoodSearchResult
  ): Promise<PassioIDAttributes | null> {
    if (Platform.OS === 'ios') {
      const result = await PassioSDKBridge.fetchSearchResult(
        JSON.stringify(queryResult)
      )
      return convertPassioFoodItemV3ToPassioIdAttributes(result)
    } else {
      const result = await PassioSDKBridge.fetchSearchResult(queryResult)
      return convertPassioFoodItemV3ToPassioIdAttributes(result)
    }
  },
}
