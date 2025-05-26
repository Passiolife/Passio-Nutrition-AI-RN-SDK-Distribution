import type { BoundingBox, PassioID } from '.'
import type { ImagesInfo } from './v3'

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
   * The nutritional data for this item in the database
   */
  foodName?: string

  /**
   * Related items above this item in the food heirarchy (more generic)
   */
  alternatives?: DetectedCandidate[] | null

  croppedImage?: ImagesInfo[] | null
}
