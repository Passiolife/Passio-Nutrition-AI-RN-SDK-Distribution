import type { NutritionFacts } from './NutritionFacts'

export interface NutritionDetectionEvent {
  nutritionFacts?: NutritionFacts
  text?: string
}
