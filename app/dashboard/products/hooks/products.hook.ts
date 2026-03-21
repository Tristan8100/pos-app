'use client'
import { getProducts, createProduct, uploadImage } from '../services/products.service'
import { useState, useEffect } from 'react'
import { Product } from '../types/products.type'

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

    const createProductService = async (payload: Omit<Product, 'id' | 'image_path'>, file: File) => {
        const image_path = await uploadImage(file)
        const payload_new = { ...payload, image_path }
        await createProduct(payload_new)
        fetchAndSetData()
    }

    return { products, fetchProducts, createProductService, loading, setLoading }
}