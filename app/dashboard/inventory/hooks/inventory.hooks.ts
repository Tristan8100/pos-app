'use client'

import { useEffect, useState } from 'react'
import { Inventory } from '../types/inventory.types'
import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  uploadImage,
  deleteImage
} from '../services/inventory.service'

export function useInventory() {
  const [data, setData] = useState<Inventory[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    const res = await getInventory()
    setData(res)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const saveItem = async (
    form: any,
    file: File | null,
    editing: Inventory | null
  ) => {
    setLoading(true)

    try {
      let image_path = editing?.image_path || null

      if (file) {
        if (editing?.image_path) {
          await deleteImage(editing.image_path)
        }
        image_path = await uploadImage(file)
      }

      const payload = { ...form, image_path }

      if (editing) {
        await updateInventory(editing.id, payload)
      } else {
        await createInventory(payload)
      }

      await fetchData()
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (item: Inventory) => {
    if (item.image_path) {
      await deleteImage(item.image_path)
    }

    await deleteInventory(item.id)
    await fetchData()
  }

  return {
    data,
    loading,
    saveItem,
    removeItem,
    refetch: fetchData,
    setData
  }
}