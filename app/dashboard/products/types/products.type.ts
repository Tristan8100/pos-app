import { Inventory } from "../../inventory/types/inventory.types";

export type IngredientForm = Omit<Ingredient, 'id' | 'product_id'>

export interface Ingredient {
  id: string;
  product_id: string;
  inventory_id: string;
  quantity: number;
} //DEPRECATED

// export interface Inventory {
//   id: string
//   name: string
//   measurement: string
//   image_path: string
//   price_per_serving: number
// }
export interface ProductIngredient {
  quantity: number
  inventory: Inventory
}

export interface Product {
  id: string
  name: string
  image_path: string
  price: number
  limited_quantity: number
  product_ingredients?: ProductIngredient[]
}