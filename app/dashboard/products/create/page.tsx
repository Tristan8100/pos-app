'use client'
import ProductsCreate from "../components/productsCreate"
import { useProducts } from "../hooks/products.hook"

export default function createProduct(){
    const { createProductService } = useProducts()
    return <>
        <ProductsCreate
                    createProductService={async (form, file, ingredients) => {
                      await createProductService(form, file, ingredients)
                    }}
                  />
    </>
}