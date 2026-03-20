'use client'

import { useState } from 'react'
import { useInventory } from '../hooks/inventory.hooks'
import { Inventory } from '../types/inventory.types'

import InventoryForm from './inventoryForm'
import InventoryCard from './inventoryCard'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

export default function InventoryClient() {
  const { data, saveItem, removeItem, loading } = useInventory()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Inventory | null>(null)

  const [form, setForm] = useState({
    name: '',
    quantity: 0,
    measurement: '',
    price_per_serving: 0
  })

  const [file, setFile] = useState<File | null>(null)

  const resetForm = () => {
    setEditing(null)
    setForm({ name: '', quantity: 0, measurement: '', price_per_serving: 0 })
    setFile(null)
  }

  const handleEdit = (item: Inventory) => {
    setEditing(item)
    setForm({
      name: item.name,
      quantity: item.quantity,
      measurement: item.measurement || '',
      price_per_serving: item.price_per_serving
    })
    setOpen(true)
  }

  const handleSubmit = async () => {
    await saveItem(form, file, editing)
    resetForm()
    setOpen(false)
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Manage your stock
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>+ Add Item</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? 'Edit Item' : 'Create Item'}
              </DialogTitle>
            </DialogHeader>

            <InventoryForm
              form={form}
              setForm={setForm}
              setFile={setFile}
              onSubmit={handleSubmit}
              loading={loading}
              editing={editing}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* LIST */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item) => (
          <InventoryCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={removeItem}
          />
        ))}
      </div>
    </div>
  )
}