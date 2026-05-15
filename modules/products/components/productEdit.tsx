import { Input } from "@/components/ui/input"
import { Inventory } from "../../inventory/types/inventory.types"
import { useInventory } from "../../inventory/hooks/inventory.hooks"
import { useState } from "react"
import { Product } from "../types/products.type"
import { FetchCategories } from "../../category/types/category.types"

interface ProductEditProps {
  form: Product
  setForm: (val: Product) => void
  file: File | null
  setFile: (file: File | null) => void
  ingredients: any[]
  setIngredients: (val: any[]) => void
  category: FetchCategories[]
}

export default function ProductEdit({
  form,
  setForm,
  file,
  setFile,
  ingredients,
  setIngredients,
  category
}: ProductEditProps) {
  const { data: inventoryList } = useInventory() 
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>("")

  const updateQuantity = (index: number, value: number) => {
    const updated = [...ingredients]
    updated[index].quantity = value
    setIngredients(updated)
  }

  const addIngredient = () => {
    if (!selectedInventoryId) return
    const item = inventoryList.find(i => i.id === selectedInventoryId)
    if (!item) return
    const exists = ingredients.find(i => i.inventory_id === item.id)
    if (exists) throw new Error("Item already exists")

    setIngredients([
      ...ingredients,
      { inventory_id: item.id, name: item.name, quantity: 1 }
    ])
    setSelectedInventoryId("")
  }

  const removeIngredient = (index: number) => {
    const updated = ingredients.filter((_, i) => i !== index)
    setIngredients(updated)
  }

  return (
    <div className="space-y-4">
      <h1 className="font-semibold text-lg">Product Edit</h1>

      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Product Name</label>
        <Input
          placeholder="Product Name"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* CATEGORY DROPDOWN - FIXED HERE */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Category</label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={form.category_id || ""}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">No Category</option>
          {category?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Price</label>
        <Input
          placeholder="Product Price"
          type="number"
          value={form.price || ""}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
      </div>

      {/* Quantity */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Limited Quantity</label>
        <Input
          placeholder="Quantity"
          type="number"
          value={form.limited_quantity}
          onChange={(e) =>
            setForm({ ...form, limited_quantity: Number(e.target.value) })
          }
        />
      </div>

      {/* File */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Product Image</label>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      {file && (
        <p className="text-xs text-green-600 font-medium">
          New image selected: {file.name}
        </p>
      )}

      {/* Ingredients Section */}
      <div className="border p-3 rounded-md space-y-3 bg-slate-50/50">
        <p className="font-semibold text-sm">Recipe Ingredients</p>

        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex justify-between items-center gap-2">
            <p className="text-sm flex-1">{ingredient.name}</p>
            <Input
              type="number"
              className="w-20 h-8"
              value={ingredient.quantity || ""}
              onChange={(e) => updateQuantity(index, Number(e.target.value))}
            />
            <button
              onClick={() => removeIngredient(index)}
              className="p-1 text-red-500 hover:bg-red-50 rounded"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="flex gap-2 items-center pt-2 border-t">
          <select
            className="border p-1 rounded text-sm flex-1 h-9"
            value={selectedInventoryId}
            onChange={(e) => setSelectedInventoryId(e.target.value)}
          >
            <option value="">Add from Inventory...</option>
            {inventoryList.map((item: Inventory) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.quantity} in stock)
              </option>
            ))}
          </select>
          <button
            onClick={addIngredient}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}