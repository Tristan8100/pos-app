'use client'
import { useEffect, useState } from "react"
import { createCategory, getCategories, updateCategory } from "../services/category.service"
import { FetchCategories } from "../types/category.types"

export function categoryHooks() {
    const [category, setCategory] = useState<FetchCategories[] | []>([])
    const [categoryName, setCategoryName] = useState('')

    const fetchCategories = async () => {
        const res = await getCategories()
        setCategory(res)
    }

    const createCategoryService = async () => {
        try {
            await createCategory({ category_name: categoryName })
            fetchCategories()
        } catch (error) {
            console.log(error)
        }
    }

    const updateCategoryService = async (id: string) => {
        try {
            await updateCategory(id, { category_name: categoryName })
            fetchCategories()
        } catch (error) {
            console.log(error)
        }
    }

    return{
        category,
        setCategory,
        categoryName,
        setCategoryName,
        createCategoryService,
        updateCategoryService,
        fetchCategories
    }
}