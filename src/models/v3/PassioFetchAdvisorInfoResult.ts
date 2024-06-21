import type { PassioAdvisorFoodInfo } from './PassioAdvisorFoodInfo'

export type PassioFetchAdvisorInfoResultError = {
  status: 'Error'
  message: string
}

export type PassioFetchAdvisorInfoResultSuccess = {
  status: 'Success'
  response: PassioAdvisorFoodInfo[]
}

export type PassioFetchAdvisorInfoResult =
  | PassioFetchAdvisorInfoResultError
  | PassioFetchAdvisorInfoResultSuccess
