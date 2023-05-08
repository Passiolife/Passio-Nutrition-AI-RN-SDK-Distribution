import type { BoundingBox } from '.'

/**
 * A UPC code captured by scanning a barcode
 */
export type Barcode = string

/**
 * A candidate resulting from barcode scanning
 */
export interface BarcodeCandidate {
  /**
   * The value of the scanned barcode
   */
  barcode: Barcode

  /**
   * A box describing the location of the barcode in the camera view
   */
  boundingBox: BoundingBox
}
