'use client'

import { useProducts } from "../hooks/products.hook"
import { useState, useEffect } from "react"
import ProductsCreate from "./productsCreate"
import ProductEdit from "./productEdit"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IngredientForm, Product } from "../types/products.type"
import ProductsList from "./productsList"
import { categoryHooks } from "../../category/hooks/category.hooks"

export default function ProductsClient() {
  const {
    products,
    loading,
    error,
    setError,
    createProductService,
    updateProductService,
    fetchAndSetData
  } = useProducts()

  const { category, fetchCategories } = categoryHooks()

  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState<any>({})
  const [file, setFile] = useState<File | null>(null)
  const [ingredients, setIngredients] = useState<any[]>([])

  useEffect(() => {
    fetchAndSetData()
    fetchCategories()
  }, [])

  // Clear error when switching views/modals to prevent ghost errors
  useEffect(() => {
    if (open || openEdit) setError(null)
  }, [open, openEdit, setError])

  const handleEditOpen = (product: Product) => {
    setError(null)
    setEditing(product)
    setForm({
      name: product.name,
      price: product.price,
      limited_quantity: product.limited_quantity,
      category_id: product.category_id
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

  const handleUpdateProduct = async () => {
    if (!editing) return
    setIsSubmitting(true)
    try {
        await updateProductService(
            editing.id,
            form,
            file,
            ingredients,
            editing.image_path
        )
        setOpenEdit(false)
    } catch (e: any) {
        console.error(e)
    } finally {
        setIsSubmitting(false)
    }
  }

  const handleCreateProduct = async (payload: Omit<Product, 'id' | 'image_path'>, file: File, ingredients: IngredientForm[]) => {
    setIsSubmitting(true)
    try {
        if (!file) {
            setError('Please select an image')
            return
        }
        await createProductService(payload, file, ingredients)
        setOpen(false)
    } catch (e: any) {
        console.error(e)
    } finally {
        setIsSubmitting(false)
    }
  }

  if (loading && products.length === 0) {
    return <div className="p-10 text-center font-medium animate-pulse">Loading products...</div>
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 border-b pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground text-sm">Manage your inventory items and recipes.</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchAndSetData}
              className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-slate-50 transition-all active:scale-95"
            >
              Refresh Data
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all active:scale-95">
                  + New Product
                </button>
              </DialogTrigger>

              <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create Product</DialogTitle>
                </DialogHeader>
                <ProductsCreate
                  category={category}
                  createProductService={handleCreateProduct}
                  setError={setError}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ERR */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-lg">⚠️</span>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-widest"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* UPDATE DIALOG */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
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
              category={category}
            />
          )}

          <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <button
              disabled={isSubmitting}
              onClick={() => setOpenEdit(false)}
              className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              disabled={isSubmitting}
              onClick={handleUpdateProduct}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-400 shadow-sm transition-all flex items-center gap-2"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <ProductsList products={products} handleEditOpen={handleEditOpen} />
      </div>
    </div>
  )
}