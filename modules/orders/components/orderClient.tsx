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
import { useShift } from "../../shift/hooks/useShift"
import useDiscounts from "@/modules/discount/hooks/useDiscounts"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { categoryHooks } from "@/modules/category/hooks/category.hooks"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"

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
    handleSubmit,
    givenChange,
    setGivenChange,
    receivedPayment,
    setReceivedPayment,
    total,
    setTotal,
    discountsItems,
    setDiscountsItems,
    search, //from useProducts
    setSearch, //from useProducts
    setSelectedCategory,
    selectedCategory
  } = ordersHooks()

  const { activeShift, refreshShift } = useShift()//use activeShift to destructure since no state of expected cashsss

  const { discounts, setDiscounts, fetchDiscounts } = useDiscounts()

  const { 
    //category, 
    fetchCategories 
  } = categoryHooks()

  const category = useSelector((state : RootState) => state.category.value);

  
  const { data, refetch, loading: loadingInventory, setData } = useInventory()

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    fetchAndSetData()
    refreshShift()
    refetch()
    fetchDiscounts()
    fetchCategories(true) //isRedux to get from redux, supports legacy code
  }

  if (loadingInventory) return <div>Loading...</div>

  if (!activeShift) return <div>NO SHIFT!!!!!</div>

  return (
    <div className="flex">
      {/* left*/}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Orders Page</h1>
        <div>{activeShift && new Date(activeShift.start_time).toLocaleString()}</div>
        <div>PHP: {activeShift?.expected_cash}</div>
        <div><Input value={search} onChange={(e) => setSearch(e.target.value)} /> <Button onClick={refresh}>Refresh</Button></div>
        <div>
          {category && category.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === selectedCategory ? "" : category.id)}
              className={`mr-2 ${
                selectedCategory === category.id ? "bg-blue-500 text-white" : ""
              }`}
            >
              {category.category_name}
            </Button>
          ))}
        </div>

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
      <OrderSummary 
        orders={orders} 
        setOrders={setOrders}
        setTotal={setTotal}
        discounts={discounts}
        total={total}
        receivedPayment={receivedPayment} 
        setReceivedPayment={setReceivedPayment} 
        givenChange={givenChange}
        setGivenChange={setGivenChange}
        expectedCash={activeShift?.expected_cash}
        handleSubmit={() => handleSubmit(refresh)}
        discountsItems={discountsItems}
        setDiscountsItems={setDiscountsItems}
      /> {/* handleSubmit(orders, total, refresh) */}
    </div>
  )
}