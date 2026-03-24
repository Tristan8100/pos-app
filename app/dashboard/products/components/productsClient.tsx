'use client'

import { useProducts } from "../hooks/products.hook"
import { useState, useEffect, use } from "react"
import ProductsCreate from "./productsCreate"
import ProductEdit from "./productEdit"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Product } from "../types/products.type"
import ProductsList from "./productsList"

export default function ProductsClient() {
  const {
    products,
    loading,
    createProductService,
    updateProductService,
    fetchAndSetData
  } = useProducts()

  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const [form, setForm] = useState<any>({})
  const [file, setFile] = useState<File | null>(null)
  const [ingredients, setIngredients] = useState<any[]>([])

  useEffect(() => {
    fetchAndSetData()
  }, []) //added since the hook also used in create, which will double call.

  if (loading) return <div>Loading...</div>

  const handleEditOpen = (product: Product) => {
    setEditing(product)

    setForm({
      name: product.name,
      price: product.price
    })

    setIngredients(
      product.product_ingredients?.map(i => ({
        inventory_id: i.inventory.id,
        name: i.inventory.name,
        quantity: i.quantity
      })) || []
    )

    setFile(null)
    setOpenEdit(true)
  }

  return (
    <div className="space-y-6 p-4">
      {/* Fetch */}
      <button
        onClick={fetchAndSetData}
        className="px-4 py-2 border rounded"
      >
        Fetch Products
      </button>

      {/* CREATE */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Product
          </button>
        </DialogTrigger>

        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Product</DialogTitle>
          </DialogHeader>

          <ProductsCreate
            createProductService={async (form, file, ingredients) => {
              await createProductService(form, file, ingredients)
              setOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* UPDATE */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="space-y-4 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
          </DialogHeader>

          {editing && (
            <ProductEdit
              form={form}
              setForm={setForm}
              file={file}
              setFile={setFile}
              ingredients={ingredients}
              setIngredients={setIngredients}
            />
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setOpenEdit(false)}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                if (!editing) return

                await updateProductService(
                  editing.id,
                  form,
                  file,
                  ingredients,
                  editing.image_path
                )

                setOpenEdit(false)
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ZA LIST */}
      <ProductsList products={products} handleEditOpen={handleEditOpen} />
    </div>
  )
}