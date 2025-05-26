export type PassioUPFRatingError = {
  status: 'Error'
  message: string
}

export type PassioUPFRatingSuccess = {
  status: 'Success'
  response: PassioUPFRating
}

export type PassioUPFRatingResult =
  | PassioUPFRatingError
  | PassioUPFRatingSuccess

export interface PassioUPFRating {
  highlightedIngredients: string[]
  rating?: number
  chainOfThought: string
}
