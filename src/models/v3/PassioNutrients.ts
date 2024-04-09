import type { UnitMass } from '..'

export interface PassioNutrients {
  /** The weight of the nutrients. */
  weight: UnitMass
  /** The amount of vitamin A. */
  vitaminA?: UnitMass
  /** The amount of alcohol. */
  alcohol?: UnitMass
  /** The amount of calcium. */
  calcium?: UnitMass
  /** The amount of calories. */
  calories?: UnitMass
  /** The amount of carbohydrates. */
  carbs?: UnitMass
  /** The amount of cholesterol. */
  cholesterol?: UnitMass
  /** The amount of fat. */
  fat?: UnitMass
  /** The amount of dietary fiber. */
  fibers?: UnitMass
  /** The amount of iodine. */
  iodine?: UnitMass
  /** The amount of iron. */
  iron?: UnitMass
  /** The amount of magnesium. */
  magnesium?: UnitMass
  /** The amount of monounsaturated fat. */
  monounsaturatedFat?: UnitMass
  /** The amount of phosphorus. */
  phosphorus?: UnitMass
  /** The amount of polyunsaturated fat. */
  polyunsaturatedFat?: UnitMass
  /** The amount of potassium. */
  potassium?: UnitMass
  /** The amount of protein. */
  protein?: UnitMass
  /** The amount of saturated fat. */
  satFat?: UnitMass
  /** The amount of sodium. */
  sodium?: UnitMass
  /** The amount of sugar alcohol. */
  sugarAlcohol?: UnitMass
  /** The amount of sugars. */
  sugars?: UnitMass
  /** The amount of added sugars. */
  sugarsAdded?: UnitMass
  /** The amount of trans fat. */
  transFat?: UnitMass
  /** The amount of vitamin B12. */
  vitaminB12?: UnitMass
  /** The amount of added vitamin B12. */
  vitaminB12Added?: UnitMass
  /** The amount of vitamin B6. */
  vitaminB6?: UnitMass
  /** The amount of vitamin C. */
  vitaminC?: UnitMass
  /** The amount of vitamin D. */
  vitaminD?: UnitMass
  /** The amount of vitamin E. */
  vitaminE?: UnitMass
  /** The amount of added vitamin E. */
  vitaminEAdded?: UnitMass

  /** The amount of added zinc E. */
  zinc?: UnitMass
  /** The amount of added selenium. */
  selenium?: UnitMass
  /** The amount of added folicAcid. */
  folicAcid?: UnitMass
  /** The amount of added vitaminKPhylloquinone. */
  vitaminKPhylloquinone?: UnitMass
  /** The amount of added vitaminKMenaquinone4. */
  vitaminKMenaquinone4?: UnitMass
  /** The amount of added vitaminKDihydrophylloquinone. */
  vitaminKDihydrophylloquinone?: UnitMass
  /** The amount of added chromium. */
  chromium?: UnitMass
}
