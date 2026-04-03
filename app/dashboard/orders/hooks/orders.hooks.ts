import { useEffect, useState } from "react"
import { useProducts } from "../../products/hooks/products.hook"
import { Product, ProductIngredient } from "../../products/types/products.type"
import { Order, SelectedOrderItem } from "../types/orders.types"
import { createOrder } from "../services/orders.service"

export function ordersHooks() {
    const { fetchAndSetData, products } = useProducts()
    
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [open, setOpen] = useState(false)

    const [orders, setOrders] = useState<SelectedOrderItem[]>([])

    const handleOpen = (product: Product) => {
    setSelectedProduct(product)
    setOpen(true)
    }

    useEffect(() => {
    console.log("ORDERS", orders)
    }, [orders])
    
    const handleAddOrder = (
    product: Product,
    items: ProductIngredient[],
    addons: Omit<ProductIngredient, 'quantity_stock'>[]
    ) => {
    setOrders((prev) => [...prev, { product, items, addons }])
    }

    const handleSubmit = async (
    newOrders: SelectedOrderItem[],
    total: number,
    refetch: () => void
    ) => {
    const products = newOrders.map((order) => ({
        id: order.product.id,
        name: order.product.name,

        items: order.items.map((ingredient) => ({
            productId: ingredient.inventory.id,
            quantity: ingredient.quantity,
            name: ingredient.inventory.name,
        })),

        addons: order.addons.map((addon) => ({
            productId: addon.inventory.id,
            quantity: addon.quantity,
            price: addon.inventory.price_per_serving,
            name: addon.inventory.name
        })),
    }))

    const payload: Omit<Order, 'id' | 'created_at' | 'staff_id' | 'status'> = {
        products,
        total,
    }

    console.log("FINAL PAYLOAD", payload)

    try {
        await createOrder(payload)
    } catch (error) {
        console.error(error)
    } finally {
        setOrders([])
        refetch()
    }
    }

    return {
        products,
        selectedProduct,
        open,
        setOpen,
        orders,
        setOrders,
        handleOpen,
        handleAddOrder,
        fetchAndSetData,
        handleSubmit
    }
}