import { useState } from "react"
import { Inventory } from "../../inventory/types/inventory.types"
import { Ingredient } from "../types/products.type"

interface ProductsCreateProps {
    addIngredients: (payload: Omit<Ingredient, 'id' | 'product_id'>) => void
    data: Inventory[]
}

export default function ProductsInventoryList({ data, addIngredients }: ProductsCreateProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [quantity, setQuantity] = useState<number>(1)

    const handleAdd = () => {
        if (!selectedId) return

        addIngredients({
            inventory_id: selectedId,
            quantity
        })

        // reset after adding
        setSelectedId(null)
        setQuantity(1)
    }

    return (
        <div className="border border-blue-500 p-4 space-y-3">
            {/* Inventory List */}
            <div className="space-y-1 overflow-y-scroll h-30">
                {data.map(item => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`cursor-pointer p-2 border rounded 
                            ${selectedId === item.id ? "bg-blue-200" : "bg-white"}`}
                    >
                        {item.name}
                    </div>
                ))}
            </div>

            {/* Quantity Input */}
            <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border p-2 w-full"
            />

            {/* Add Button */}
            <button
                onClick={handleAdd}
                disabled={!selectedId}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
                Add Ingredient
            </button>
        </div>
    )
}