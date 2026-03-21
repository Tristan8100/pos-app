export interface Ingredient {
  ingredientId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  image_path: string;
  price: number;
  ingredients: Ingredient[];
}