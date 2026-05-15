'use client'
import { getProducts, createProduct, uploadImage, addIngredients, deleteImage, updateProduct, deleteIngredients } from '../services/products.service'
import { useState, useEffect } from 'react'
import { Ingredient, IngredientForm, Product } from '../types/products.type'
import { getCategories } from '../../category/services/category.service'

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProducts = async () => {
        const res = await getProducts()
        return res
    }

    async function fetchAndSetData() {
        setLoading(true)
        try {
            const res = await fetchProducts()
            setProducts(res)
        } catch (err: any) {
            setError(err?.message)
        } finally {
            setLoading(false)
        }
    }

    const createProductService = async (
        payload: Omit<Product, 'id' | 'image_path'>,
        file: File,
        ingredients: IngredientForm[]
    ) => {
        try {
            const image_path = await uploadImage(file)
            const payload_new = { ...payload, image_path }

            const data = await createProduct(payload_new)

            console.log(data)

            const newData: Omit<Ingredient, 'name' | 'id'>[] = ingredients.map(({name, ...ingredient}) => ({ //prevent name to send
                ...ingredient,
                product_id: data.id
            }))

            await addIngredients(newData)
            await fetchAndSetData()
        } catch (err: any) {
            setError(err?.message || err)
            throw err
        }
    }

    const updateProductService = async (
        id: string,
        payload: Omit<Product, 'id' | 'image_path'>,
        file: File | null,
        ingredients: IngredientForm[],
        currentImagePath?: string
    ) => {
        try {
            let image_path = currentImagePath

            if (file) {
                const newPath = await uploadImage(file)

                if (currentImagePath) {
                    await deleteImage(currentImagePath)
                }

                image_path = newPath
            }

            await updateProduct(id, {
                ...payload,
                image_path
            })

            await deleteIngredients(id)

            const mapped = ingredients.map(i => ({
                product_id: id,
                inventory_id: i.inventory_id,
                quantity: i.quantity
            }))

            console.log("MAPPED", mapped)

            await addIngredients(mapped)
            await fetchAndSetData()
        } catch (err: any) {
            setError(err.message)
            throw err
        }
    }

    return { 
        products, 
        fetchProducts, 
        createProductService, 
        loading, 
        setLoading, 
        updateProductService, 
        fetchAndSetData, 
        setProducts,
        error, // new added
        setError
    }
}