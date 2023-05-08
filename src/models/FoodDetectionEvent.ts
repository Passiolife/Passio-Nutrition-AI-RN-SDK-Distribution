import type { FoodCandidates, NutritionFacts } from '.'

/**
 * An object provided in the callback for food detection containing
 * food candidates as well as nutrition facts, if found
 */
export interface FoodDetectionEvent {
  /**
   * A collection of food candidates detected by the models.
   */
  candidates?: FoodCandidates
  /**
   * Detected nutrition facts when scanning a nutrition label.
   */
  nutritionFacts?: NutritionFacts
}
