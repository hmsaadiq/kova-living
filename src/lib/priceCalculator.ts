import type { Product, SelectedOptions } from './types'

export function calculatePrice(product: Product, selectedOptions: SelectedOptions): number {
  let total = product.base_price

  for (const group of product.options) {
    const selectedValue = selectedOptions[group.name]
    if (!selectedValue) continue

    const choice = group.choices.find((c) => c.value === selectedValue)
    if (choice) total += choice.priceModifier
  }

  return total
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}
