'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { getImageUrl } from "@/helpers/getImage"
import { Product } from "../../products/types/products.type"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

export function ProductDialog({ open, onOpenChange, product }: Props) {
  if (!product) return null

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

          {product.product_ingredients?.length ? (
            <div>
              <p className="font-medium mb-1">Ingredients</p>

              <div className="space-y-1 text-sm">
                {product.product_ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{ingredient.inventory.name}</span>
                    <span className="text-muted-foreground">
                      {ingredient.quantity} {ingredient.inventory.measurement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No ingredients listed.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}