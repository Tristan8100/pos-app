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
  const { category, fetchCategories, categoryName, setCategoryName, createCategoryService, updateCategoryService } = categoryHooks()
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
            <Button onClick={() => createCategoryService()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG (Fixed: One dialog controlled by selection) */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Category</DialogTitle></DialogHeader>
          <Input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <DialogFooter className="gap-2">
            <Button onClick={handleUpdate}>Update</Button>
            <Button variant="ghost" onClick={() => setEditingItem(null)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}