import { createClient } from '@/lib/supabase/client'

const BUCKET = 'pos-bucker'

export const supabase = createClient()

export async function getInventory() {
  const { data } = await supabase.from('inventory').select('*').order('name', { ascending: false })
  return data || []
}

export async function createInventory(payload: any) {
  return supabase.from('inventory').insert(payload)
}

export async function updateInventory(id: string, payload: any) {
  return supabase.from('inventory').update(payload).eq('id', id)
}

export async function deleteInventory(id: string) {
  return supabase.from('inventory').delete().eq('id', id)
}

export async function uploadImage(file: File) {
  const filePath = `inventory/${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file)

  if (error) throw error

  return filePath
}

export async function deleteImage(path: string) {
  return supabase.storage.from(BUCKET).remove([path])
}

export function getImageUrl(path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}