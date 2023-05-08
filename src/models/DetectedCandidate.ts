import type { AmountEstimate, BoundingBox, PassioID } from '.'

/**
 * A food candidate detected from visual scanning
 */
export interface DetectedCandidate {
  /**
   * The ID of the detected item
   */
  passioID: PassioID

  /**
   * Confidence of the classification candidate, ranging from 0.0 to 1.0
   */
  confidence: number

  /**
   * A box describing a detected object's location in the camera view
   */
  boundingBox: BoundingBox

  /**
   * Supported only in IOS
   * Scanned AmountEstimate
   */
  amountEstimate?: AmountEstimate
}
