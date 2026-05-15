export interface Inventory {
  id: string
  name: string
  image_path: string | null
  quantity: number
  measurement: string | null
  price_per_serving: number
}

// Make only `id` optional
export type InventoryCreate = Omit<Inventory, 'id'> & { id?: string }