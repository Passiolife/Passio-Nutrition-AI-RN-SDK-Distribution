import type { PassioID } from './PassioID'

export type PersonalizedAlternative = {
  visualPassioID: PassioID
  nutritionalPassioID: PassioID
  servingUnit?: string
  servingSize?: number
}
