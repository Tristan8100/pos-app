'use client'

import { useEffect, useState } from "react"
import { SelectedOrderItem } from "../types/orders.types"
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
import { Discount } from "@/modules/discount/types/discount.types"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import {
  addDiscountItem,
  removeOrderAtIndex,
  setGivenChangeValue,
  setOrderTotal,
  setOrdersValue,
  setReceivedPaymentValue,
} from "../feature/store"

export function OrderSummary({
  expectedCash,
  handleSubmit,
}: {
  expectedCash: number | undefined
  handleSubmit: () => void
}) {
  const dispatch = useDispatch()
  const orders = useSelector((state: RootState) => state.orders.orders)
  const total = useSelector((state: RootState) => state.orders.total)
  const receivedPayment = useSelector((state: RootState) => state.orders.receivedPayment)
  const givenChange = useSelector((state: RootState) => state.orders.givenChange)
  const discountsItems = useSelector((state: RootState) => state.orders.discountsItems)
  const discounts = useSelector((state: RootState) => state.discount.value) ?? []

  const [cashDrawer, setCashDrawer] = useState(0)

  const [productId, setProductId] = useState('')
  const [discountSelected, setDiscountSelected] = useState<Discount | null>(null)

  const addDiscount = async () => {
    const discounted = discounts.find(d => d.id === discountSelected?.id)
    if(!discounted) {
      throw new Error('Discount not found')
    }

    if(productId === '') {
      throw new Error('Please select a product')
    }

    dispatch(addDiscountItem({ productId: productId, discount: discounted }))
  }

  useEffect(() => { //logger
  }, [discountSelected])

  console.log("DISCOUNTS ITEMS", discountsItems) // remove!!!!!!

  const handlePayment = async (grandTotal: number) => {
    dispatch(setOrderTotal(grandTotal))
    console.log("GRAND TOTAL", grandTotal)
    if(receivedPayment > cashDrawer) {
      throw new Error('Not enough cash in drawer') // NO CHANGE!!
    }

    console.log("HANDLE PAYMENT", receivedPayment, grandTotal)
    dispatch(setGivenChangeValue(receivedPayment - grandTotal))

    await handleSubmit()

  }

  console.log("discounts", discounts)

  const handleChangeComputation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value); //use to get new value, useState is async idk
    if(newValue > cashDrawer) {
      //throw new Error('Not enough cash in drawer') // NO CHANGE!!
    }
    dispatch(setReceivedPaymentValue(newValue));

    dispatch(setGivenChangeValue(newValue - total));
  }

  const handleRemove = (index: number) => {
    dispatch(removeOrderAtIndex(index))
  }


  const calculateItemTotal = (item: SelectedOrderItem) => {
    const base = item.product.price
    const addons = item.addons.reduce((sum, addon) => {
      return sum + addon.inventory.price_per_serving * addon.quantity
    }, 0)

    let total = 0;

    //discount calculation
    if(productId === item.product.id && discountSelected) {
      const discounted = discounts.find(d => d.id === discountSelected.id)
      if(!discounted) {
        throw new Error('Discount not found')
      }
      total = base + addons - (base + addons) * (discounted.discount/100)
    } else {
      total = base + addons
    }

    return total
  }

  const processTotal = orders.reduce((sum, item) => sum + calculateItemTotal(item), 0)

  useEffect(() => {
    console.log("ORDERS", orders)
    dispatch(setOrderTotal(processTotal))
    setCashDrawer(expectedCash || 0)
  }, [orders, dispatch, expectedCash, productId, discountSelected])

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
                <div className="flex justify-center items-center flex-col">
                  <p className="font-semibold">{item.product.name}</p>
                  <button
                    onClick={() => handleRemove(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                  <button onClick={() => setProductId(item.product.id)}>add to discount</button>
                  <div>
                    {productId === item.product.id && (
                      <div>selected</div>
                    )}
                  </div>
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
          <div className="border-t pt-2 font-bold">
            {productId !== "" && discountSelected &&
              <button onClick={() => addDiscount()}>add discount</button>
            }
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

          <div>
            {discounts && discounts.map((discount) => (
              <div key={discount.id} className="border p-2 rounded space-y-2">
                <div className="flex justify-between">
                  <p className="font-semibold">{discount.name}</p>
                </div>
                <p className="font-bold">-{discount.discount}%</p>
                <p className="font-bold">₱{discount.remove_vat ? "remove vat" : "with vat"}</p>
                <button onClick={() => setDiscountSelected(discount)}>add discount</button>
                <div>
                  {discountSelected?.id === discount.id && (
                    <div>selected</div>
                  )}
                </div>
              </div>
            ))}
            ryiyieyieyi
          </div>
        </div>
      )}
    </div>
  )
}