import { Product, ProductIngredient } from "../../products/types/products.type"

export interface OrderItem {
  productId: string
  name: string
  quantity: number
}

export interface OrderAddon {
  productId: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  staff_id: string
  created_at?: string
  status: string
  total: number
  // items: OrderItem[]
  // addons: OrderAddon[]
  products: ProductAdded[]
}
export interface ProductAdded {
  id: string
  name: string
  items: OrderItem[]
  addons: OrderAddon[]
}

export interface SelectedOrderItem { //for state only, too limited if use Order
  product: Product
  items: ProductIngredient[]
  addons: Omit<ProductIngredient, 'quantity_stock'>[]
}