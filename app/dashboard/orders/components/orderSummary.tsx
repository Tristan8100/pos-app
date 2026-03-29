'use client'

import { Product, ProductIngredient } from "../../products/types/products.type"
import { Order, SelectedOrderItem } from "../types/orders.types"
import { createOrder } from "../services/orders.service"
import { ordersHooks } from "../hooks/orders.hooks"

export function OrderSummary({
  orders,
  setOrders,
  handleSubmit
}: {
  orders: SelectedOrderItem[]
  setOrders: React.Dispatch<React.SetStateAction<SelectedOrderItem[]>>
  handleSubmit: (newOrders: SelectedOrderItem[], total: number) => Promise<void>
}) {

  const handleRemove = (index: number) => {
    setOrders((prev) => prev.filter((_, i) => i !== index))
  }

  const calculateItemTotal = (item: SelectedOrderItem) => {
    const base = item.product.price

    const addons = item.addons.reduce((sum, addon) => {
      return sum + addon.inventory.price_per_serving * addon.quantity
    }, 0)

    return base + addons
  }

  const grandTotal = orders.reduce((sum, item) => {
    return sum + calculateItemTotal(item)
  }, 0)


  return (
    <div className="w-80 border-l p-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      {orders.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <div className="space-y-4">

          {orders.map((item, index) => {
            const total = calculateItemTotal(item)

            return (
              <div key={index} className="border p-2 rounded space-y-2">

                {/* HEADER */}
                <div className="flex justify-between">
                  <p className="font-semibold">{item.product.name}</p>

                  <button
                    onClick={() => handleRemove(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>

                {/* ADDONS */}
                <div className="text-sm">
                  {item.addons.length === 0 ? (
                    <p className="text-muted-foreground">No addons</p>
                  ) : (
                    item.addons.map((addon, i) => {
                      const price =
                        addon.inventory.price_per_serving * addon.quantity

                      return (
                        <p key={i}>
                          {addon.inventory.name} x{addon.quantity} = ₱{price}
                        </p>
                      )
                    })
                  )}
                </div>

                {/* TOTAL */}
                <p className="font-bold">₱{total}</p>
              </div>
            )
          })}

          {/* GRAND TOTAL */}
          <div className="border-t pt-2 font-bold">
            Grand Total: ₱{grandTotal}
          </div>

          {/* SUBMIT */}
          <button
            onClick={() => handleSubmit(orders, grandTotal)}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Submit Order
          </button>
        </div>
      )}
    </div>
  )
}