import type { BoundingBox, ClassificationCandidate } from '.'

/**
 * A candidate resulting from object detection models
 */
export interface ObjectDetectionCandidate extends ClassificationCandidate {
  /**
   * A box describing a detected object's location in the camera view
   */
  boundingBox: BoundingBox
}
