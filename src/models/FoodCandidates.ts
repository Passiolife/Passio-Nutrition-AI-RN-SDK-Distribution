import type { BarcodeCandidate, DetectedCandidate, PackagedFoodCode } from '.'

/**
 * A collection of food candidates detected by the models.
 */
export interface FoodCandidates {
  /**
   * Food candidate results from visual scanning. The array is sorted by confidence, with the most confident result at index 0.
   */
  detectedCandidates: DetectedCandidate[]

  /**
   * Food candidate results from barcode scanning.
   */
  barcodeCandidates?: BarcodeCandidate[]

  /**
   * Food candidate results from packagedFoodCode scanning.
   */
  packagedFoodCode?: PackagedFoodCode[]
}
