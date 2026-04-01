import { useProducts } from "../hooks/products.hook"
import { useState } from "react"
import { Ingredient, IngredientForm, Product } from "../types/products.type"
import { useInventory } from "../../inventory/hooks/inventory.hooks"
import { Input } from "@/components/ui/input"
import ProductsInventoryList from "./productsInventoryList"
import { FetchCategories } from "../../category/types/category.types"

interface ProductsCreateProps {
    createProductService: (payload: Omit<Product, 'id' | 'image_path'>, file: File, ingredients: IngredientForm[]) => Promise<void>
    category: FetchCategories[]
}

export default function ProductsCreate({ createProductService, category }: ProductsCreateProps) {
    const { data } = useInventory()
    const [file, setFile] = useState<File | null>(null)

    const [form, setForm] = useState<Omit<Product, 'id'>>({
          name: "",
          image_path: "",
          price: 0,
          limited_quantity: 0,
          category_id: "" //newly addd
    })

    const [ingredients, setIngredients] = useState<IngredientForm[]>([])

    // Modified to handle both Input and Select changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: name === 'price' || name === 'limited_quantity' ? Number(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
             if (!file) {
                alert('Please select an image')
                return
            }
            await createProductService(form, file, ingredients)

            // reset form
            setForm({
                name: '',
                image_path: '',
                price: 0,
                limited_quantity: 0,
                category_id: ''
            })
            setFile(null)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddIngredient = (data : Omit<Ingredient, 'id' | 'product_id'>) => {
        setIngredients(prev => [...prev, data])
    }

    return (
        <div className="p-4 space-y-6">
            <h1>Products Create</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Product name"
                />

                {/* CATEGORY SELECT DROPDOWN */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Select Category</label>
                    <select 
                        name="category_id" 
                        value={form.category_id} 
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Select a category</option>
                        {category?.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price"
                />

                <Input
                    name="limited_quantity"
                    type="number"
                    value={form.limited_quantity}
                    onChange={handleChange}
                    placeholder="Limited Quantity"
                />

                <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Create Product
                </button>
            </form>

            <div className="mt-8">
                <h2 className="font-bold">Ingredients Available...</h2>
                <ProductsInventoryList addIngredients={handleAddIngredient} data={data} />
            </div>
        </div>
    )
}