export type PassioResultError = {
  status: 'Error'
  message: string
}

export type PassioResultSuccess = {
  status: 'Success'
  response: boolean
}

export type PassioResult = PassioResultError | PassioResultSuccess

export interface PassioReport {
  refCode: string
  productCode: string
  notes?: string[]
}
