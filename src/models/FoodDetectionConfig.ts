/**
 * A configuration object to determine which types of recognition should be performed by
 * the SDK. There is currently no flag to control visual food recognition models, they are
 * enabled by default.
 */
export interface FoodDetectionConfig {
  /**
   * Detect packaged food labels using OCR. Results will be returned
   * as OCRCandidates in the `FoodCandidates` property of `FoodDetectionEvent`
   * By default, this is set to false.
   */
  detectPackagedFood?: boolean

  /**
   * Detect barcodes on packaged food products. Results will be returned
   * as `BarcodeCandidates` in the `FoodCandidates` property of `FoodDetectionEvent`
   * By default, this is set to false.
   */
  detectBarcodes?: boolean

  /**
   Only set to false if you don't want to use the ML Models to detect food.
   * By default, this is set to true.
   */
  detectVisual?: boolean
}
