/*
 * A record returned from the barcode look up API. Only needed
 * if you are self hosting or creating a proxy to Passio's API.
 */
export interface UPCProduct {
  id: string
  name: string
  nutrients: {
    nutrient: {
      id: number
      name: string
      unit: string
      shortName?: string
      origin: {
        source: string
        id: string
        timestamp: string
      }[]
    }
    amount: number
  }[]
  portions: {
    weight: {
      unit: string
      value: number
    }
    name: string
    quantity: number
  }[]
  branded: {
    owner: string
    upc: string
    ingredients: string
    country: string
  }
  origin: {
    source: string
    id: string
    dataType?: string
    timestamp: string
  }[]
  timestamp: string
}
