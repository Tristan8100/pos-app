import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useProducts } from "../../products/hooks/products.hook"
import { Product, ProductIngredient } from "../../products/types/products.type"
import { DiscountItem, Order, SelectedOrderItem } from "../types/orders.types"
import { createOrder } from "../services/orders.service"
import { RootState } from "@/lib/store"
import {
    addDiscountItem,
    addOrderValue,
    clearOrders,
    resetOrderPayment,
    setDiscountsItemsValue,
    setGivenChangeValue,
    setOrderTotal,
    setOrdersValue,
    setReceivedPaymentValue,
} from "../feature/store"

export function ordersHooks() {
    const { fetchAndSetData, products, search, setSearch, selectedCategory, setSelectedCategory } = useProducts()
    const dispatch = useDispatch()

    const orders = useSelector((state: RootState) => state.orders.orders)
    const total = useSelector((state: RootState) => state.orders.total)
    const givenChange = useSelector((state: RootState) => state.orders.givenChange)
    const receivedPayment = useSelector((state: RootState) => state.orders.receivedPayment)
    const discountsItems = useSelector((state: RootState) => state.orders.discountsItems)

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [open, setOpen] = useState(false)

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
        dispatch(addOrderValue({ product, items, addons }))
    }

    const handleSubmit = async (refetch: () => void) => {
        const products = orders.map((order) => {
            const disc = discountsItems.find((discountItem) => discountItem.productId === order.product.id)

            return {
                id: order.product.id,
                name: order.product.name,
                price: order.product.price,
                discount: disc?.discount,

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
            }
        })

        const payload: Omit<Order, 'id' | 'created_at' | 'staff_id' | 'status'> = {
            products,
            total,
        }

        const payload2: { givenChange: number, receivedPayment: number } = {
            givenChange,
            receivedPayment,
        }

        console.log("FINAL PAYLOAD", payload)
        console.log("FINAL PAYLOAD 2", payload2)

        try {
            await createOrder(payload, payload2)
        } catch (error) {
            console.error(error)
        } finally {
            dispatch(clearOrders())
            dispatch(resetOrderPayment())
            dispatch(setDiscountsItemsValue([]))
            dispatch(setOrdersValue([]))
            dispatch(setOrderTotal(0))
            dispatch(setReceivedPaymentValue(0))
            dispatch(setGivenChangeValue(0))
            refetch()
        }
    }

    return {
        products,
        selectedProduct,
        open,
        setOpen,
        orders,
        setOrders: (value: SelectedOrderItem[] | ((prev: SelectedOrderItem[]) => SelectedOrderItem[])) => {
            const nextValue = typeof value === 'function'
                ? value(orders)
                : value

            dispatch(setOrdersValue(nextValue))
        },
        handleOpen,
        handleAddOrder,
        fetchAndSetData,
        handleSubmit,
        givenChange,
        setGivenChange: (value: number | ((prev: number) => number)) => {
            const nextValue = typeof value === 'function' ? value(givenChange) : value
            dispatch(setGivenChangeValue(nextValue))
        },
        receivedPayment,
        setReceivedPayment: (value: number | ((prev: number) => number)) => {
            const nextValue = typeof value === 'function' ? value(receivedPayment) : value
            dispatch(setReceivedPaymentValue(nextValue))
        },
        total,
        setTotal: (value: number | ((prev: number) => number)) => {
            const nextValue = typeof value === 'function' ? value(total) : value
            dispatch(setOrderTotal(nextValue))
        },
        discountsItems,
        setDiscountsItems: (value: DiscountItem[] | ((prev: DiscountItem[]) => DiscountItem[])) => {
            const nextValue = typeof value === 'function'
                ? value(discountsItems)
                : value

            dispatch(setDiscountsItemsValue(nextValue))
        },
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
    }
}