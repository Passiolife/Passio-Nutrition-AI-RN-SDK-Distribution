import type {
  PassioAdvisorMessageResultStatus,
  PassioAdvisorResponse,
  PassioAdvisorResultStatus,
} from '../models'
import { NativeModules, Platform } from 'react-native'
import type { NutritionAdvisorInterface } from './NutritionAdvisorInterface'

const { PassioSDKBridge } = NativeModules

export const NutritionAdvisor: NutritionAdvisorInterface = {
  async configure(
    licenseKey: string
  ): Promise<PassioAdvisorResultStatus | null> {
    return PassioSDKBridge.configureAIAdvisor(licenseKey)
  },
  async initConversation(): Promise<PassioAdvisorResultStatus | null> {
    return PassioSDKBridge.initConversationAIAdvisor()
  },

  async sendMessage(
    message: string
  ): Promise<PassioAdvisorMessageResultStatus | null> {
    return PassioSDKBridge.sendMessageAIAdvisor(message)
  },

  async sendImage(
    imageURI: string
  ): Promise<PassioAdvisorMessageResultStatus | null> {
    try {
      return PassioSDKBridge.sendImageAIAdvisor(imageURI)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  async fetchIngredients(
    response: PassioAdvisorResponse
  ): Promise<PassioAdvisorMessageResultStatus | null> {
    if (Platform.OS === 'android') {
      return PassioSDKBridge.fetchIngredientsAIAdvisor(response)
    } else {
      return PassioSDKBridge.fetchIngredientsAIAdvisor(JSON.stringify(response))
    }
  },
}
