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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/page-layout"
import { Plus, RefreshCw, Search } from "lucide-react"

export default function ProductsClient() {
  const {
    products,
    loading,
    error,
    setError,
    createProductService,
    updateProductService,
    fetchAndSetData,
    search,
    setSearch,
    selectedCategory, //id
    setSelectedCategory //id
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
    fetchCategories(true)
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

  return (
    <>
      <PageLayout
        title="Products"
        description="Manage your inventory items and recipes."
        badge={
          !loading ? (
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          ) : null
        }
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1 sm:w-52">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products"
                aria-label="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={fetchAndSetData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Product
                </Button>
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
        }
      >
        {category.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b p-4 sm:px-6">
            {category.map((c) => (
              <Button
                key={c.id}
                variant={selectedCategory === c.id ? "default" : "outline"}
                aria-pressed={selectedCategory === c.id}
                onClick={() => setSelectedCategory(c.id === selectedCategory ? "" : c.id)}
              >
                {c.category_name}
              </Button>
            ))}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="m-4 flex items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive sm:mx-6"
          >
            <p>{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="shrink-0 text-destructive hover:text-destructive"
            >
              Dismiss
            </Button>
          </div>
        )}

        {loading && products.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground" aria-live="polite">
            Loading products...
          </div>
        ) : (
          <ProductsList products={products} handleEditOpen={handleEditOpen} />
        )}
      </PageLayout>

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

          <div className="mt-6 flex justify-end gap-3 border-t pt-6">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setOpenEdit(false)}
            >
              Cancel
            </Button>
            <Button disabled={isSubmitting} onClick={handleUpdateProduct}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}