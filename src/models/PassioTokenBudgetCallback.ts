import type { PassioTokenBudget } from './PassioTokenBudget'

export interface PassioAccountListener {
  onTokenBudgetUpdate: (tokenBudget: PassioTokenBudget) => void
}
