'use client'

import { Inventory } from '../types/inventory.types'
import { getImageUrl } from '../services/inventory.service'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'

type Props = {
  item: Inventory
  onEdit: (item: Inventory) => void
  onDelete: (item: Inventory) => void
}

export default function InventoryCard({
  item,
  onEdit,
  onDelete
}: Props) {
  const imageUrl = item.image_path
    ? getImageUrl(item.image_path)
    : null

  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm">
      {/* IMAGE */}
      <div className="h-32 bg-muted rounded-xl mb-3 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground">
            No Image
          </span>
        )}
      </div>

      {/* INFO */}
      <h2 className="font-semibold">{item.name}</h2>
      <p className="text-sm text-muted-foreground">
        {item.quantity} {item.measurement || ''}
      </p>
      <p className="text-sm text-muted-foreground">
        Price Per Serving: {item.price_per_serving}
      </p>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-4">
        <Button onClick={() => onEdit(item)} variant="outline">
          Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete "{item.name}"?
              </AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(item)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}