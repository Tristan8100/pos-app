import { createClient } from '@/lib/supabase/client'
import { Order } from '../types/orders.types'

const BUCKET = 'pos-bucker'

export const supabase = createClient()

export async function createOrder(
  payload: Omit<Order, 'id' | 'created_at' | 'staff_id' | 'status'>
) {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  const user = userData?.user
  if (userError || !user) throw new Error('User not authenticated')

  // 1. Validate product IDs + fetch limited_quantity (deduplicated)
  const productIds = Array.from(new Set(payload.products.map((p) => p.id)))

  const { data: productData, error: productError } = await supabase
    .from('products')
    .select('id, limited_quantity')
    .in('id', productIds)

  if (productError) throw productError

  if (!productData || productData.length !== productIds.length) {
    const existingIds = productData?.map((p) => p.id) ?? []
    const missingIds = productIds.filter((id) => !existingIds.includes(id))
    throw new Error(`Products not found: ${missingIds.join(', ')}`)
  }

  // 2. Check limited_quantity threshold per product accounting for duplicate orders
  const lowStockProducts = productData.filter((p) => {
    const orderCount = payload.products.filter((op) => op.id === p.id).length
    return p.limited_quantity - orderCount < 10
  })

  if (lowStockProducts.length > 0) {
    const names = payload.products
      .filter((p) => lowStockProducts.some((lp) => lp.id === p.id))
      .map((p) => p.name)
      .join(', ')
    throw new Error(`Insufficient stock for products: ${names}`)
  }

  // 3. Validate inventory IDs
  const inventoryIds = Array.from(
    new Set(
      payload.products
        .flatMap((p) => [
          ...p.items.map((i) => i.productId),
          ...p.addons.map((a) => a.productId),
        ])
        .filter(Boolean)
    )
  )

  const { data: inventoryData, error: inventoryError } = await supabase
    .from('inventory')
    .select('*')
    .in('id', inventoryIds)

  if (inventoryError) throw inventoryError

  if (!inventoryData || inventoryData.length !== inventoryIds.length) {
    const existingIds = inventoryData?.map((i) => i.id) ?? []
    const missingIds = inventoryIds.filter((id) => !existingIds.includes(id))
    throw new Error(`Inventory items not found: ${missingIds.join(', ')}`)
  }

  // 4. Calculate total deduction per inventory ID across all order instances
  const getTotalQuantity = (inventoryId: string) =>
    payload.products.reduce((sum, product) => {
      const fromItems = product.items
        .filter((i) => i.productId === inventoryId)
        .reduce((s, i) => s + i.quantity, 0)

      const fromAddons = product.addons
        .filter((a) => a.productId === inventoryId)
        .reduce((s, a) => s + a.quantity, 0)

      return sum + fromItems + fromAddons
    }, 0)

  // 5. Check inventory stock
  const insufficientInventory = inventoryData.filter(
    (item) => item.quantity - getTotalQuantity(item.id) < 0
  )

  if (insufficientInventory.length > 0) {
    const names = insufficientInventory.map((i) => i.name).join(', ')
    throw new Error(`Insufficient inventory for: ${names}`)
  }

  // 6. Deduct inventory
  for (const item of inventoryData) {
    const needed = getTotalQuantity(item.id)
    if (needed === 0) continue

    const { error } = await supabase
      .from('inventory')
      .update({ quantity: item.quantity - needed })
      .eq('id', item.id)

    if (error) throw error
  }

  // 7. Deduct limited_quantity per product by order count
  for (const product of productData) {
    const orderCount = payload.products.filter((p) => p.id === product.id).length

    const { error } = await supabase
      .from('products')
      .update({ limited_quantity: product.limited_quantity - orderCount })
      .eq('id', product.id)

    if (error) throw error
  }

  // 8. Insert order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([{ ...payload, staff_id: user.id, status: 'pending' }])
    .select()
    .single()

  if (orderError) throw orderError

  return orderData
}