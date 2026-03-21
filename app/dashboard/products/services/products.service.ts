import { createClient } from '@/lib/supabase/client'
import { Product } from '../types/products.type'


const BUCKET = 'pos-bucker'

export const supabase = createClient()

export async function getProducts() {
    const { data } = await createClient().from('products').select('*')
    return data || []
}

export async function getOneProduct(id: string) {
    const { data } = await createClient().from('products').select('*').eq('id', id).single()
    return data
}

export async function uploadImage(file: File) {
  const filePath = `products/${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file)

  if (error) throw error

  return filePath
}

export async function createProduct(payload: Omit<Product, 'id' | 'image_path'>) {
  return supabase.from('products').insert([payload])
}

export async function updateProduct(id: string, payload: any) {
  return supabase.from('products').update(payload).eq('id', id)
}

export async function deleteProduct(id: string) {
  return supabase.from('products').delete().eq('id', id)
}

export function getImageUrl(path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}