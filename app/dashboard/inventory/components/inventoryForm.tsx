'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Inventory } from '../types/inventory.types'

type Props = {
  form: {
    name: string
    quantity: number
    measurement: string
    price_per_serving: number
  }
  setForm: (val: any) => void
  setFile: (file: File | null) => void
  onSubmit: () => void
  loading: boolean
  editing: Inventory | null
}

export default function InventoryForm({
  form,
  setForm,
  setFile,
  onSubmit,
  loading,
  editing
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium">Name</p>
        <Input
          value={form.name}
          onChange={(e) =>
            setForm((prev: any) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-sm font-medium">Quantity</p>
          <Input
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                quantity: Number(e.target.value)
              }))
            }
          />
        </div>

        <div>
          <p className="text-sm font-medium">Unit</p>
          <Input
            value={form.measurement}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                measurement: e.target.value
              }))
            }
          />
        </div>

        <div>
          <p className="text-sm font-medium">Price Per Serving</p>
          <Input
            value={form.price_per_serving}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                price_per_serving: e.target.value
              }))
            }
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Image</p>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <Button onClick={onSubmit} disabled={loading} className="w-full">
        {editing ? 'Update Item' : 'Create Item'}
      </Button>
    </div>
  )
}