import type { PassioID } from '.'

/**
 * A candidate resulting from image classification models
 */
export interface ClassificationCandidate {
  /**
   * The ID of the detected item
   */
  passioID: PassioID

  /**
   * Confidence of the classification candidate, ranging from 0.0 to 1.0
   */
  confidence: number
}
