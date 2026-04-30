'use client'
import { useEffect, useState } from "react"
import { createCategory, getCategories, updateCategory } from "../services/category.service"
import { FetchCategories } from "../types/category.types"

export function categoryHooks() {
    const [category, setCategory] = useState<FetchCategories[] | []>([])
    const [categoryName, setCategoryName] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)

    const fetchCategories = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getCategories()
            setCategory(res)
        } catch (error) {
            console.log(error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const createCategoryService = async () => {
        setLoading(true)
        setError(null)
        try {
            await createCategory({ category_name: categoryName })
            fetchCategories()
        } catch (error) {
            console.log(error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    const updateCategoryService = async (id: string) => {
        setLoading(true)
        setError(null)
        try {
            await updateCategory(id, { category_name: categoryName })
            fetchCategories()
        } catch (error) {
            console.log(error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    return{
        category,
        setCategory,
        categoryName,
        setCategoryName,
        loading,
        error,
        createCategoryService,
        updateCategoryService,
        fetchCategories
    }
}