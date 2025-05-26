export interface PassioFoodMetadata {
  barcode?: string
  ingredientsDescription?: string
  tags?: string[] | null
  foodOrigins?: PassioFoodOrigin[] | null
  concerns?: number[] | null
}

export interface PassioFoodOrigin {
  id: string
  licenseCopy?: string
  source?: string
}
