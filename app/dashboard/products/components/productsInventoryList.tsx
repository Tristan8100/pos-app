import { useState } from "react"
import { Inventory } from "../../inventory/types/inventory.types"
import { Ingredient } from "../types/products.type"

interface ProductsCreateProps {
    addIngredients: (payload: Omit<Ingredient, 'id' | 'product_id'>) => void
    inventory: Inventory[]
}

export default function ProductsInventoryList({ inventory, addIngredients }: ProductsCreateProps) {
    const [selectedInventory, setSelectedInventory] = useState<{ id: string, name: string } | null>(null)
    const [quantity, setQuantity] = useState<number>(1)

    const handleAdd = () => {
        if (!selectedInventory) return

        addIngredients({
            inventory_id: selectedInventory.id,
            quantity,
            name: selectedInventory.name
        })

        // reset after adding
        setSelectedInventory(null)
        setQuantity(1)
    }

    return (
        <div className="border border-blue-500 p-4 space-y-3">
            {/* Inventory List */}
            <div className="space-y-1 overflow-y-scroll h-30">
                {inventory.map(item => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedInventory(item)}
                        className={`cursor-pointer p-2 border rounded 
                            ${selectedInventory?.id === item.id ? "bg-blue-200" : "bg-white"}`}
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
                disabled={!selectedInventory}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
                Add Ingredient
            </button>
        </div>
    )
}