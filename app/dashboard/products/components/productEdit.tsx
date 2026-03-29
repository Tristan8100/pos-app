'use client'

import { Input } from "@/components/ui/input"
import { Inventory } from "../../inventory/types/inventory.types"
import { useInventory } from "../../inventory/hooks/inventory.hooks"
import { useState } from "react"
import { Product } from "../types/products.type"

interface ProductEditProps {
  form: Product
  setForm: (val: Product) => void

  file: File | null
  setFile: (file: File | null) => void

  ingredients: any[]
  setIngredients: (val: any[]) => void
}

export default function ProductEdit({
  form,
  setForm,
  file,
  setFile,
  ingredients,
  setIngredients
}: ProductEditProps) {
  const { data: inventoryList } = useInventory() // all inventory items
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>("")

  // Update quantity of existing ingredient
  const updateQuantity = (index: number, value: number) => {
    const updated = [...ingredients]
    updated[index].quantity = value
    setIngredients(updated)
  }

  // Add new ingredient from inventory
  const addIngredient = () => {
    if (!selectedInventoryId) return

    const item = inventoryList.find(i => i.id === selectedInventoryId)
    if (!item) return

    // Prevent duplicates
    const exists = ingredients.find(i => i.inventory_id === item.id)
    if (exists){
      throw new Error("Item already exists")
    }

    setIngredients([
      ...ingredients,
      {
        inventory_id: item.id,
        name: item.name,
        quantity: 1
      }
    ])
    setSelectedInventoryId("")
  }

  // Removeee
  const removeIngredient = (index: number) => {
    const updated = ingredients.filter((_, i) => i !== index)
    setIngredients(updated)
  }

  return (
    <div className="space-y-4">

      <h1 className="font-semibold">Product Edit</h1>

      {/* Name */}
      <Input
        placeholder="Product Name"
        value={form.name || ""}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      {/* Price */}
      <Input
        placeholder="Product Price"
        type="number"
        value={form.price || ""}
        onChange={(e) =>
          setForm({ ...form, price: Number(e.target.value) })
        }
      />

      {/* Quantity */}
      <div>limited quantity</div>
      <Input
        placeholder="Quantity"
        type="number"
        value={form.limited_quantity}
        onChange={(e) =>
          setForm({ ...form, limited_quantity: Number(e.target.value) })
        }
      />

      {/* File */}
      <Input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      {file && (
        <p className="text-xs text-green-600">
          New image: {file.name}
        </p>
      )}

      {/* Ingredients */}
      <div className="border p-2 rounded space-y-2">
        <p className="font-semibold">Ingredients</p>

        {/* Existing ingredients */}
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex justify-between items-center gap-2"
          >
            <p className="text-sm">{ingredient.name}</p>

            <Input
              type="number"
              className="w-24"
              value={ingredient.quantity || ""}
              onChange={(e) =>
                updateQuantity(index, Number(e.target.value))
              }
            />

            <button
              onClick={() => removeIngredient(index)}
              className="px-2 py-1 border rounded"
            >
              X
            </button>
          </div>
        ))}

        {/* Add new ingredient */}
        <div className="flex gap-2 items-center mt-2">
          <select
            className="border p-1 rounded flex-1"
            value={selectedInventoryId}
            onChange={(e) => setSelectedInventoryId(e.target.value)}
          >
            <option value="">Select Inventory</option>
            {inventoryList.map((item: Inventory) => (
              <option key={item.id} value={item.id}>
                {item.name} (Stock: {item.quantity})
              </option>
            ))}
          </select>

          <button
            onClick={addIngredient}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}