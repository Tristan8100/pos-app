'use client'

import { useEffect, useState } from "react"
import { useProducts } from "../../products/hooks/products.hook"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getImageUrl } from "@/helpers/getImage"
import { ProductDialog } from "./orderCreate"
import { Product, ProductIngredient } from "../../products/types/products.type"
import { OrderSummary } from "./orderSummary"
import { ordersHooks } from "../hooks/orders.hooks"
import { useInventory } from "../../inventory/hooks/inventory.hooks"
import { ref } from "node:process"

export function OrdersClient() {
  const { 
    products,
    selectedProduct,
    open,
    setOpen,
    orders,
    setOrders,
    handleOpen,
    handleAddOrder,
    fetchAndSetData,
    handleSubmit
  } = ordersHooks()

  
  const { data, refetch, loading, setData } = useInventory()

  useEffect(() => {
    fetchAndSetData()
    refetch()
  }, [])

  async function refresh() {
    fetchAndSetData()
    refetch()
  }
  

  return (
    <div className="flex">
      {/* left*/}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Orders Page</h1>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                onClick={() => handleOpen(product)}
                className="cursor-pointer hover:shadow-lg transition"
              >
                <CardHeader>
                  <CardTitle className="text-lg">
                    {product.name} Current Stock: {product.limited_quantity}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  {product.image_path && (
                    <img
                      src={getImageUrl(product.image_path)}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}

                  <p className="font-semibold">₱{product.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ProductDialog
          open={open}
          onOpenChange={setOpen}
          product={selectedProduct}
          onSubmit={handleAddOrder}
          data={data}
        />
      </div>

      {/* za right*/}
      <OrderSummary orders={orders} setOrders={setOrders} handleSubmit={(orders, total) => handleSubmit(orders, total, refresh)} />
    </div>
  )
}