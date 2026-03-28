import { createClient } from '@/lib/supabase/client'
import { Order } from '../types/orders.types'

const BUCKET = 'pos-bucker'

export const supabase = createClient()

export async function createOrder(
  payload: Omit<Order, 'id' | 'created_at' | 'staff_id' | 'status'>
) {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  const user = userData?.user
  if (userError || !user) throw new Error("User not authenticated")

  const allProductIds = [
    ...payload.items.map(i => i.productId),
    ...payload.addons.map(a => a.productId)
  ]

  const { data: inventoryData, error: inventoryError } = await supabase
    .from('inventory')
    .select('*')
    .in('id', allProductIds)

  if (inventoryError) throw inventoryError

  if (!inventoryData || inventoryData.length !== allProductIds.length) {
    const existingIds = inventoryData?.map(i => i.id) || []
    const missingIds = allProductIds.filter(id => !existingIds.includes(id))
    throw new Error(`Invalid product IDs: ${missingIds.join(', ')}`)
  }

  const lowStock = inventoryData.filter(item => {
    const orderedItem = payload.items.find(i => i.productId === item.id)
    const orderedAddon = payload.addons.find(a => a.productId === item.id)
    const totalQuantity = (orderedItem?.quantity || 0) + (orderedAddon?.quantity || 0)
    return item.quantity - totalQuantity < 10
  })

  if (lowStock.length > 0) {
    const names = lowStock.map(i => i.name).join(', ')
    throw new Error(`Insufficient stock for: ${names}`)
  }

  for (const item of inventoryData) {
    const orderedItem = payload.items.find(i => i.productId === item.id)
    const orderedAddon = payload.addons.find(a => a.productId === item.id)
    const totalQuantity = (orderedItem?.quantity || 0) + (orderedAddon?.quantity || 0)

    if (totalQuantity > 0) {
      const newQuantity = item.quantity - totalQuantity
      const { error } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', item.id)
      if (error) throw error
    }
  }

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([{ ...payload, staff_id: user.id }])
    .select()
    .single()

  if (orderError) throw orderError

  return orderData
}