'use client'

import { useProducts } from "../hooks/products.hook"
import { useState } from "react"
import { Ingredient, IngredientForm, Product } from "../types/products.type"
import { useInventory } from "../../inventory/hooks/inventory.hooks"
import { Input } from "@/components/ui/input"
import ProductsInventoryList from "./productsInventoryList"



interface ProductsCreateProps {
    createProductService: (payload: Omit<Product, 'id' | 'image_path'>, file: File, ingredients: IngredientForm[]) => Promise<void>
}

export default function ProductsCreate({ createProductService }: ProductsCreateProps) {
    const { data } = useInventory()
    const [file, setFile] = useState<File | null>(null)

    const [form, setForm] = useState<Omit<Product, 'id'>>({
          name: "",
          image_path: "",
          price: 0,
    })

    const [ingredients, setIngredients] = useState<IngredientForm[]>([])

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
        await createProductService(form, file, ingredients)

        // reset form
        setForm({
            name: '',
            image_path: '',
            price: 0,
        })
    }

    const handleAddIngredient = (data : Omit<Ingredient, 'id' | 'product_id'>) => {
        setIngredients(prev => [...prev, data])
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

                <button type="submit" className="border border-red-500">
                    Create Product
                </button>
            </form>
            <div>Ingredients Available...</div>
            <ProductsInventoryList addIngredients={handleAddIngredient} data={data} />
        </div>
    )
}