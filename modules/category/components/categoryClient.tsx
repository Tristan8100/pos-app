'use client'

import { useEffect, useState } from "react"
import { categoryHooks } from "../hooks/category.hooks"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function CategoryClient() {
  const { 
    category, 
    fetchCategories, 
    categoryName, 
    setCategoryName, 
    createCategoryService, 
    updateCategoryService,
    error,
    loading
  } = categoryHooks()

  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<{id: string, name: string} | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleEditOpen = (item: any) => {
    setEditingItem({ id: item.id, name: item.category_name })
    setCategoryName(item.category_name)
  }

  const handleUpdate = async () => {
    if (editingItem) {
      await updateCategoryService(editingItem.id)
      setEditingItem(null)
    }
  }

  return (
    <div className="p-4">
      <h1>Category</h1>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="mb-4 p-2 border border-red-500 text-red-500 rounded">
          {error.message || 'Something went wrong'}
        </div>
      )}
      
      {loading && (
        <div className="mb-2 text-sm text-gray-500">
          Loading...
        </div>
      )}

      {/* Category List */}
      <div className="space-y-2 mb-4">
        {category && category.map((item) => (
          <div key={item.id} className="flex items-center gap-2 p-2 border rounded">
            <span className="flex-1">{item.category_name}</span>
            <Button onClick={() => handleEditOpen(item)}>Edit</Button>
          </div>
        ))}
      </div>

      {/* CREATE DIALOG */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Category</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Category</DialogTitle></DialogHeader>
          <Input 
            value={categoryName} 
            onChange={(e) => setCategoryName(e.target.value)} 
            placeholder="New Category Name" 
          />
          <DialogFooter>
            <Button onClick={() => createCategoryService()} disabled={loading}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Category</DialogTitle></DialogHeader>
          <Input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <DialogFooter className="gap-2">
            <Button onClick={handleUpdate} disabled={loading}>Update</Button>
            <Button variant="ghost" onClick={() => setEditingItem(null)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}