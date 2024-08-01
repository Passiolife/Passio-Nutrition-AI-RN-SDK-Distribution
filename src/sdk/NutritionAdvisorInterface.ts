import type {
  PassioAdvisorMessageResultStatus,
  PassioAdvisorResponse,
  PassioAdvisorResultStatus,
} from '../models'

/**
 * Interface for the Nutrition Advisor module, providing methods for configuring, initiating conversations,
 * sending messages and images, and fetching ingredients.
 */
export interface NutritionAdvisorInterface {
  /**
   * Initiates a conversation with the Nutrition Advisor.
   * @returns A Promise resolving to the status of the conversation initiation.
   */
  initConversation(): Promise<PassioAdvisorResultStatus | null>

  /**
   * Sends a text message to the Nutrition Advisor.
   * @param message - The message to be sent.
   * @returns A Promise resolving to the status of the message sending.
   */
  sendMessage(message: string): Promise<PassioAdvisorMessageResultStatus | null>

  /**
   * Sends an image to the Nutrition Advisor.
   * @param imageURI - The local URI of the image to be sent.
   * @returns A Promise resolving to the status of the image sending.
   */
  sendImage(imageURI: string): Promise<PassioAdvisorMessageResultStatus | null>

  /**
   * Fetches ingredients from the Nutrition Advisor's response.
   * @param response - The response object from the Nutrition Advisor.
   * @returns A Promise resolving to the status of the ingredient fetching.
   */
  fetchIngredients(
    response: PassioAdvisorResponse
  ): Promise<PassioAdvisorMessageResultStatus | null>
}
