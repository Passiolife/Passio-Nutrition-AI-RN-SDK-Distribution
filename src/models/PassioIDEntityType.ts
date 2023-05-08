/**
 * The type of object represented by a `PassioIDAttributes`
 */
export enum PassioIDEntityType {
  /**
   * A parent node in the food heirarchy (e.g. pasta), will only be returned if the models could not detect something more specific
   */
  group = 'group',

  /**
   * A leaf node in the food heirarchy, meaning a specific food item that has been identified by the models
   */
  item = 'item',

  /**
   * A leaf node in the food heirarchy, meaning a specific food item that has been identified by the models
   */
  recipe = 'recipe',

  /**
   * A food product identified via barcode scanning
   */
  barcode = 'barcode',

  /**
   * A food product identified via reading the text on the packaging label
   */
  packagedFoodCode = 'packagedFoodCode',
}
