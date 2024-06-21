import type { PassioAdvisorResponse } from './PassioAdvisorResponse'

export type PassioAdvisorMessageResponseError = {
  status: 'Error'
  message: string
}

export type PassioAdvisorMessageResponseSuccess = {
  status: 'Success'
  response: PassioAdvisorResponse
}

export type PassioAdvisorMessageResultStatus =
  | PassioAdvisorMessageResponseError
  | PassioAdvisorMessageResponseSuccess
