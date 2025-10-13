import type { BarcodeCandidate } from '.'

/**
 * A collection of food candidates detected by the models.
 */
export interface BarcodeScanEvent {
  /**
   * Food candidate results from barcode scanning.
   */
  barcodeCandidates?: BarcodeCandidate[]
}
