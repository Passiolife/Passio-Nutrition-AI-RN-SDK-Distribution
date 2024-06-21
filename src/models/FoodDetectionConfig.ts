/**
 * A configuration object to determine which types of recognition should be performed by
 * the SDK. There is currently no flag to control visual food recognition models, they are
 * enabled by default.
 */
export interface FoodDetectionConfig {
  /**
   * Detect packaged food labels using OCR. Results will be returned
   * as OCRCandidates in the `FoodCandidates` property of `FoodDetectionEvent`
   */
  detectPackagedFood: boolean

  /**
   * Detect barcodes on packaged food products. Results will be returned
   * as `BarcodeCandidates` in the `FoodCandidates` property of `FoodDetectionEvent`
   */
  detectBarcodes: boolean

  /**
   * Supported only in IOS
   * Scanned AmountEstimate
   */
  volumeDetectionMode?: 'auto' | 'dualWideCamera' | 'none'
}
