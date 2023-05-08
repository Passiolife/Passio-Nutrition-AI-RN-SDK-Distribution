import type { EstimationQuality } from './EstimationQuality'
import type { MoveDirection } from './MoveDirection'

/**
 * Returning all information of Amount estimation and directions how to move the device for better estimation
 */
export interface AmountEstimate {
  /**
   * The quality of the estimate (eventually for feedback to the user or SDK-based app developer)
   */
  estimationQuality: EstimationQuality

  /**
   * Hints how to move the device for better estimation.
   */
  moveDevice?: MoveDirection

  /**
   * The Angel in radians from the perpendicular surface.
   */
  viewingAngle?: number

  /**
   * Scanned Volume estimate in ml
   */
  volumeEstimate?: number

  /**
   *  Scanned Amount in grams
   */
  weightEstimate?: number
}
