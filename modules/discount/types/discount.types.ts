export interface Discount {
  id: string
  name: string
  discount: number
  remove_vat: boolean
}

// Make only `id` optional
export type DiscountCreate = Omit<Discount, 'id'> & { id?: string }