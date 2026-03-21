'use client'

import { useProducts } from "../hooks/products.hook"
import { useState } from "react"
import { Ingredient, Product } from "../types/products.type"
import { useInventory } from "../../inventory/hooks/inventory.hooks"
import { Input } from "@/components/ui/input"
import ProductsInventoryList from "./productsInventoryList"

interface ProductsCreateProps {
    createProductService: (payload: Omit<Product, 'id' | 'image_path'>, file: File) => Promise<void>
}

export default function ProductsCreate({ createProductService }: ProductsCreateProps) {
    const { data } = useInventory()
    const [file, setFile] = useState<File | null>(null)

    const [form, setForm] = useState<Omit<Product, 'id'>>({
          name: "",
          image_path: "",
          price: 0,
          ingredients: []
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            return
        }
        await createProductService(form, file)

        // reset form
        setForm({
            name: '',
            image_path: '',
            price: 0,
            ingredients: []
        })
    }

    const handleAddIngredient = (data: Ingredient) => {
        setForm((prev) => {
            const exists = prev.ingredients.some(
                (item) => item.ingredientId === data.ingredientId
            )

            if (exists) {
                console.log('ALREADY EXISTS')
                return prev
            }

            const updated = {
                ...prev,
                ingredients: [...prev.ingredients, data]
            }

            console.log('UPDATED:', updated.ingredients)
            return updated
        })
    }

    return (
        <div>
            <h1>Products Create</h1>

            <form onSubmit={handleSubmit}>
                <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Product name"
                />

                <Input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price"
                />

                <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                <button type="submit">
                    Create Product
                </button>
            </form>
            <div>Ingredients Available...</div>
            <ProductsInventoryList addIngredients={handleAddIngredient} data={data} />
        </div>
    )
}