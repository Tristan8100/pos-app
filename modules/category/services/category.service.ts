import { createClient } from '@/lib/supabase/client'
const BUCKET = 'pos-bucker'

export const supabase = createClient()

export async function getCategories() {
    const { data, error } = await supabase
        .from('category')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error

    return data || []
}

export async function createCategory(datas: any) {
    const { data, error } = await supabase
        .from('category')
        .insert(datas)

    if (error) throw error

    return data
}

export async function updateCategory(id: string, datas: any) {
    const { data, error } = await supabase
        .from('category')
        .update(datas)
        .eq('id', id)

    if (error) throw error

    return data
}