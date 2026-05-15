import { createClient } from '@/lib/supabase/client'
import { DiscountCreate } from '../types/discount.types'
const BUCKET = 'pos-bucker'

export const supabase = createClient()

export async function getDiscount() {
    const { data, error } = await supabase.from('discounts').select('*')

    if (error) throw error

    return data || []
}

export async function createDiscount(datas: DiscountCreate) {
    const { data, error } = await supabase.from('discounts').insert(datas)

    if (error) throw error

    return data
}

export async function updateDiscount(id: string, datas: DiscountCreate) {
    const { data, error } = await supabase.from('discounts').update(datas).eq('id', id)

    if (error) throw error

    return data
}

export async function deleteDiscount(id: string) {
    const { data, error } = await supabase.from('discounts').delete().eq('id', id)

    if (error) throw error

    return data
}