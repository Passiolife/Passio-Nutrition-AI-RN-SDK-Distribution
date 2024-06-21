import type { PassioAdvisorFoodInfo } from '../v3'

/* Defining the interface for the PassioAdvisorResponse object */
export interface PassioAdvisorResponse {
  /* Unique identifier for the thread */
  threadId: string
  /* Unique identifier for the message */
  messageId: string
  /* Raw content of the message */
  rawContent: string
  /* Content of the message with markup */
  markupContent: string
  /* Optional array of tools used */
  tools?: string[]
  /* Optional array of food ingredients (mostly received on sendImage response) */
  extractedIngredients?: PassioAdvisorFoodInfo[]
}
