'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useEffect, useState } from "react"
import { getImageUrl } from "@/helpers/getImage"
import { Product, ProductIngredient } from "../../products/types/products.type"
import { useInventory } from "../../inventory/hooks/inventory.hooks"
import { Input } from "@/components/ui/input"
import { Inventory } from "../../inventory/types/inventory.types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  data: Inventory[]
  onSubmit: (
    product: Product,
    items: ProductIngredient[],
    addons: ProductIngredient[]
  ) => void
}

export function ProductDialog({ open, onOpenChange, product, onSubmit, data }: Props) {

  const [ingredients, setIngredients] = useState<ProductIngredient[]>([])
  const [addons, setAddons] = useState<ProductIngredient[]>([])

  useEffect(() => {
    if (product) {
      setIngredients(product.product_ingredients || [])
      setAddons([])
    }
  }, [product])

  useEffect(() => {
    console.log("ADDONS", addons)
  }, [addons])

  const handleAddAddons = (item: Omit<ProductIngredient, 'quantity_stock'>) => {
    setAddons((prev) => [...prev, item])
  }

  if (!product || !data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {product.image_path && (
            <img
              src={getImageUrl(product.image_path)}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
          )}

          <p className="text-lg font-semibold">₱{product.price}</p>

          {/* INGREDIENTS */}
          <div>
            <p className="font-medium mb-1">Ingredients</p>

            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1">{ingredient.inventory.name} Current Stock {ingredient.inventory.quantity}</span>

                <Input
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value)

                    setIngredients((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, quantity: value } : item
                      )
                    )
                  }}
                  className="w-20"
                />
              </div>
            ))}
          </div>

          {/* ADDONS */}
          <div>
            <p className="font-medium">Addons</p>

            {addons.map((addon, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1">{addon.inventory.name}</span>

                <Input
                  type="number"
                  value={addon.quantity}
                  onChange={(e) => {
                    const value = Number(e.target.value)

                    setAddons((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, quantity: value } : item
                      )
                    )
                  }}
                  className="w-20"
                />
              </div>
            ))}
          </div>

          {/* ADD ADDONS LIST */}
          <div>
            <p className="font-medium">Available Addons</p>

            <div className="flex flex-wrap gap-2">
              {data.map((item) => (
                <button
                  key={item.id}
                  className="border px-2 py-1 rounded"
                  onClick={() =>
                    handleAddAddons({
                      inventory: item,
                      quantity: 1,
                    })
                  }
                >
                  {item.name} (₱{item.price_per_serving}) Current Stock {item.quantity}
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            className="w-full bg-black text-white py-2 rounded"
            onClick={() => {
              onSubmit(product, ingredients, addons)
              onOpenChange(false)
            }}
          >
            Add to Order
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}