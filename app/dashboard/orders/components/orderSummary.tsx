'use client'

import { useEffect, useState } from "react"
import { Product, ProductIngredient } from "../../products/types/products.type"
import { Order, SelectedOrderItem } from "../types/orders.types"
import { createOrder } from "../services/orders.service"
import { ordersHooks } from "../hooks/orders.hooks"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function OrderSummary({
  orders,
  setOrders,
  setTotal,
  total,
  receivedPayment,
  setReceivedPayment,
  givenChange,
  setGivenChange,
  expectedCash,
  handleSubmit
}: {
  orders: SelectedOrderItem[]
  setOrders: React.Dispatch<React.SetStateAction<SelectedOrderItem[]>>
  setTotal: React.Dispatch<React.SetStateAction<number>>
  total: number
  receivedPayment: number
  setReceivedPayment: React.Dispatch<React.SetStateAction<number>>
  givenChange: number
  setGivenChange: React.Dispatch<React.SetStateAction<number>>
  expectedCash: number | undefined
  handleSubmit: () => void
}) {

  const [cashDrawer, setCashDrawer] = useState(0)

  const handlePayment = async (grandTotal: number) => {
    setTotal(grandTotal) //set total to grand total
    console.log("GRAND TOTAL", grandTotal)
    if(receivedPayment > cashDrawer) {
      throw new Error('Not enough cash in drawer') // NO CHANGE!!
    }

    console.log("HANDLE PAYMENT", receivedPayment, grandTotal)
    setGivenChange(receivedPayment - grandTotal)

    await handleSubmit()

  }

  const handleChangeComputation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value); //use to get new value, useState is async idk
    if(newValue > cashDrawer) {
      //throw new Error('Not enough cash in drawer') // NO CHANGE!!
    }
    setReceivedPayment(newValue);
    
    setGivenChange(newValue - total);
  }

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

  const processTotal = orders.reduce((sum, item) => sum + calculateItemTotal(item), 0)

  useEffect(() => {
    console.log("ORDERS", orders)
    setTotal(processTotal)
    setCashDrawer(expectedCash || 0)
  }, [orders, setTotal, expectedCash])

  return (
    <div className="w-80 border-l p-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <h2 className="text-xl font-bold mb-4">CashDrawer: ₱{cashDrawer}</h2>

      {orders.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((item, index) => {
            const total = calculateItemTotal(item)
            return (
              <div key={index} className="border p-2 rounded space-y-2">
                <div className="flex justify-between">
                  <p className="font-semibold">{item.product.name}</p>
                  <button
                    onClick={() => handleRemove(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="text-sm">
                  {item.addons.length === 0 ? (
                    <p className="text-muted-foreground">No addons</p>
                  ) : (
                    item.addons.map((addon, i) => {
                      const price = addon.inventory.price_per_serving * addon.quantity
                      return (
                        <p key={i}>
                          {addon.inventory.name} x{addon.quantity} = ₱{price}
                        </p>
                      )
                    })
                  )}
                </div>
                <p className="font-bold">₱{total}</p>
              </div>
            )
          })}

          <div className="border-t pt-2 font-bold">
            Grand Total: ₱{total}
          </div>

          {/* PAYMENT DIALOG */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full bg-green-600 text-white py-2 rounded">
                Submit Order
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Payment</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>₱{total}</span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount Received</label>
                  <Input 
                    type="number" 
                    placeholder="0.00"
                    onChange={(e) => handleChangeComputation(e)}
                  />
                </div>

                {receivedPayment > 0 && (
                  <div className="flex justify-between text-md font-semibold border-t pt-2">
                    <span>Change:</span>
                    <span className={givenChange < 0 ? "text-red-500" : "text-green-600"}>
                      ₱{givenChange.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="text-red-500">{receivedPayment > cashDrawer && "Not enough cash in drawer"}</div>
                <div>{cashDrawer}</div>
              </div>

              <DialogFooter>
                <Button 
                  disabled={receivedPayment < total || receivedPayment > cashDrawer}
                  className="w-full"
                  onClick={() => handlePayment(total)}
                >
                  Confirm Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}