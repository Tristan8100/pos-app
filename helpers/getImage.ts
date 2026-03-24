import { createClient } from '@/lib/supabase/client'
const BUCKET = 'pos-bucker'

export const supabase = createClient()

export function getImageUrl(path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}