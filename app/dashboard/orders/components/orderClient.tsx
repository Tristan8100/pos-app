'use client'

import { useEffect, useState } from "react"
import { useProducts } from "../../products/hooks/products.hook"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getImageUrl } from "@/helpers/getImage"
import { ProductDialog } from "./orderCreate"
import { Product } from "../../products/types/products.type"

export function OrdersClient() {
    const { fetchAndSetData, products } = useProducts()

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetchAndSetData()
    }, [])

    const handleOpen = (product: Product) => {
        setSelectedProduct(product)
        setOpen(true)
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Products</h1>

            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            onClick={() => handleOpen(product)}
                            className="cursor-pointer hover:shadow-lg transition"
                        >
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {product.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                {product.image_path && (
                                    <img
                                        src={getImageUrl(product.image_path)}
                                        alt={product.name}
                                        className="w-full h-32 object-cover rounded mb-2"
                                    />
                                )}

                                <p className="font-semibold">₱{product.price}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <ProductDialog
                open={open}
                onOpenChange={setOpen}
                product={selectedProduct}
            />
        </div>
    )
}