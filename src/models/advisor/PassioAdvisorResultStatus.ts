export type PassioAdvisorResultError = {
  status: 'Error'
  message: string
}

export type PassioAdvisorResultSuccess = {
  status: 'Success'
}

export type PassioAdvisorResultStatus =
  | PassioAdvisorResultSuccess
  | PassioAdvisorResultError
