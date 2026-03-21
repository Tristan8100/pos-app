'use client'

import { useProducts } from "../hooks/products.hook"
import { useState } from "react"
import ProductsCreate from "./productsCreate"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Product } from "../types/products.type"

export default function ProductsClient() {
    const { products, fetchProducts, loading, createProductService } = useProducts()

    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editing, setEditing] = useState<Product | null>(null)

    if (loading) return <div>Loading...</div>

    const handleEditOpen = (product: Product) => {
        setEditing(product)
        setOpenEdit(true)
    }

    return (
        <div className="space-y-6 p-4">
            <button
                onClick={fetchProducts}
                className="px-4 py-2 border rounded"
            >
                Fetch Products
            </button>

            {/* Create Product Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                        Create Product
                    </button>
                </DialogTrigger>

                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Product</DialogTitle>
                    </DialogHeader>

                    <ProductsCreate
                        createProductService={async (form, file) => {
                            await createProductService(form, file)
                            setOpen(false)
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Update Product Dialog */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="space-y-4 max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Update Product</DialogTitle>
                    </DialogHeader>

                    {editing && (
                        <div className="space-y-3">
                            <Input
                                placeholder="Product Name"
                                defaultValue={editing.name}
                            />

                            <Input
                                placeholder="Product Price"
                                type="number"
                                defaultValue={editing.price}
                            />

                            <Input type="file" />

                            <p className="text-sm text-gray-500">
                                Current Image: {editing.image_path || "None"}
                            </p>

                            {/* Ingredients */}
                            <div className="border p-2 rounded space-y-1">
                                <p className="font-semibold">Ingredients</p>

                                {editing.ingredients?.length ? (
                                    editing.ingredients.map((ingredient) => (
                                        <div
                                            key={ingredient.ingredientId}
                                            className="flex justify-between text-sm border-b pb-1"
                                        >
                                            <span>{ingredient.ingredientId}</span>
                                            <span>Qty: {ingredient.quantity}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm">
                                        No ingredients
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setOpenEdit(false)}
                                    className="px-3 py-1 border rounded"
                                >
                                    Cancel
                                </button>

                                <button className="px-3 py-1 bg-blue-500 text-white rounded">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Products List */}
            <ul className="space-y-2">
                {products?.map(product => (
                    <div
                        className="border p-3 rounded flex justify-between items-center"
                        key={product.id}
                    >
                        <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">
                                ₱{product.price}
                            </p>
                        </div>

                        <button
                            onClick={() => handleEditOpen(product)}
                            className="px-3 py-1 border rounded"
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </ul>
        </div>
    )
}