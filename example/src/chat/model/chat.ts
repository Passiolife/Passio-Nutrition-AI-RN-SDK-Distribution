import type { PassioAdvisorResponse } from '@passiolife/nutritionai-react-native-sdk-v3'

export type messageType = 'text' | 'image' | 'response' | 'typing'
export interface ChatEntity {
  type: messageType
  message?: string
  error?: string
  uri?: string
  response?: PassioAdvisorResponse | null
}
