import { createClient } from '@/lib/supabase/client'
import { Ingredient, Product } from '../types/products.type'


const BUCKET = 'pos-bucker'

export const supabase = createClient()

export async function getProducts() {
  const { data, error } = await createClient()
    .from('products')
    .select(`
      *,
      product_ingredients (
        quantity,
        inventory (
          id,
          name,
          measurement,
          price_per_serving,
          image_path,
          quantity
        )
      ),
      category (
        *
      )
    `)

  if (error) {
    console.error('Error fetching products:', error.message)
    throw new Error(error.message)
  }

  return data || []
}

export async function getOneProduct(id: string) {
    const { data, error } = await createClient().from('products').select('*').eq('id', id).single()

    if (error) {
      console.error('Error fetching one product:', error.message)
      throw new Error(error.message)
    }

    return data
}

export async function uploadImage(file: File) {
  const filePath = `products/${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file)

  if (error) {
    console.error('Error uploading image on product:', error.message)
    throw new Error(error.message)
  }

  if (error) throw error

  return filePath
}

export async function deleteImage(path: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .remove([path])

  if (error) {
    console.error('Error deleting image on product:', error.message)
    throw new Error(error.message)
  }

  return data
}

export async function createProduct(payload: Omit<Product, 'id' | 'image_path'>) {
  const { data, error } = await supabase.from('products').insert([payload]).select().single()

  if (error) {
    console.error('Error creating product:', error.message)
    throw new Error(error.message)
  }

  return data
}

export async function addIngredients(payload: Omit<Ingredient, 'id'>[]) {//should be an array of objects
  const { data, error } = await supabase.from('product_ingredients').insert(payload)

  if (error) {
    console.error('Error adding ingredients:', error.message)
    throw new Error(error.message)
  }

  return data
}

export async function deleteIngredients(productId: string) {
  const { data, error } = await supabase
    .from('product_ingredients')
    .delete()
    .eq('product_id', productId)

  if (error) {
    console.error('Error deleting ingredients:', error.message)
    throw new Error(error.message)
  }

  return data
}

export async function updateProduct(id: string, payload: any) {
  const { data, error } = await supabase.from('products').update(payload).eq('id', id)

  if (error) {
    console.error('Error updating product:', error.message)
    throw new Error(error.message)
  }

  return data
}

export async function deleteProduct(id: string) {
  const { data, error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    console.error('Error deleting product:', error.message)
    throw new Error(error.message)
  }

  return data
}

export function getImageUrl(path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}