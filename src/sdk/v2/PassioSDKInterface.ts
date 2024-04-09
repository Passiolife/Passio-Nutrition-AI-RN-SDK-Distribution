import type { PassioIDAttributes } from '../../models/v2'
import type {
  Barcode,
  FoodSearchResult,
  PackagedFoodCode,
  PassioID,
} from '../../models'
import type { PassioSDKInterface as PassioSDKInterfaceV3 } from '../PassioSDKInterface'

/*
This API provides backward compatibility with the v3 structure while also accommodating the new structure for v2 API support. In essence, it transforms the new structure to the old one to ensure compatibility with the v2 structure.
*/
export interface PassioSDKInterface
  extends Omit<
    PassioSDKInterfaceV3,
    | 'getAttributesForPassioID'
    | 'fetchAttributesForBarcode'
    | 'fetchPassioIDAttributesForPackagedFood'
    | 'fetchSearchResult'
  > {
  /**
   * Look up the nutrition attributes for a given Passio ID.
   * @param passioID - The Passio ID for the attributes query.
   * @returns A `Promise` resolving to a `PassioIDAttributes` object if the record exists in the database or `null` if not.
   */
  getAttributesForPassioID(
    passioID: PassioID
  ): Promise<PassioIDAttributes | null>

  /**
   * Query Passio's UPC web service for nutrition attributes of a given barcode.
   * @param barcode - The barcode value for the attributes query, typically taken from a scanned `BarcodeCandidate`.
   * @returns A `Promise` resolving to a `PassioIDAttributes` object if the record exists in the database or `null` if not.
   */
  fetchAttributesForBarcode(
    barcode: Barcode
  ): Promise<PassioIDAttributes | null>

  /**
   * Query Passio's web service for nutrition attributes given an package food identifier.
   * @param packagedFoodCode - The code identifier for the attributes query, taken from the list of package food candidates on a `FoodDetectionEvent`.
   * @returns A `Promise` resolving to a `PassioIDAttributes` object if the record exists in the database or `null` if not.
   */
  fetchPassioIDAttributesForPackagedFood(
    packagedFoodCode: PackagedFoodCode
  ): Promise<PassioIDAttributes | null>

  /**
   * Detail of search food with a given search result.
   * @param result - Provide `PassioSearchResult` object get `PassioIDAttributes` detail.
   * @returns A `Promise` resolving to `PassioIDAttributes` detail.
   */
  fetchSearchResult(
    result: FoodSearchResult
  ): Promise<PassioIDAttributes | null>
}
