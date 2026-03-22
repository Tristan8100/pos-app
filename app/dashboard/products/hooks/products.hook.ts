'use client'
import { getProducts, createProduct, uploadImage, addIngredients, deleteImage, updateProduct, deleteIngredients } from '../services/products.service'
import { useState, useEffect } from 'react'
import { IngredientForm, Product } from '../types/products.type'

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)

    const fetchProducts = async () => {
        const res = await getProducts()
        return res
    }

    useEffect(() => {
        fetchAndSetData()
    }, [])

    async function fetchAndSetData() {
        setLoading(true)
        const res = await fetchProducts()
        setProducts(res)
        setLoading(false)
    }

    const createProductService = async (
        payload: Omit<Product, 'id' | 'image_path'>,
        file: File,
        ingredients: IngredientForm[]
    ) => {
        const image_path = await uploadImage(file)
        const payload_new = { ...payload, image_path }

        const { data, error } = await createProduct(payload_new)
        if (error || !data) throw error

        const newData = ingredients.map(ingredient => ({
            ...ingredient,
            product_id: data.id
        }))

        await addIngredients(newData)

        fetchAndSetData()
    }

    const updateProductService = async (
    id: string,
    payload: Omit<Product, 'id' | 'image_path'>,
    file: File | null,
    ingredients: IngredientForm[],
    currentImagePath?: string
  ) => {
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

    await addIngredients(mapped)

    await fetchAndSetData()
  }

    return { products, fetchProducts, createProductService, loading, setLoading, updateProductService }
}