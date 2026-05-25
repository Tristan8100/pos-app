import { getDiscount, createDiscount, updateDiscount, deleteDiscount } from "../services/discount.service";
import { useState } from "react";
import { Discount, DiscountCreate } from "../types/discount.types";

export default function useDiscounts() {
    const [discounts, setDiscounts] = useState<Discount[]>([])

    const fetchDiscounts = async () => {
        try {
            const discounts = await getDiscount()
            setDiscounts(discounts)
        } catch (error) {
            console.log(error)
        }
    }

    const create = async (data: DiscountCreate) => {
        try{
            const discount = await createDiscount(data)
            fetchDiscounts()
        } catch (error) {
            console.log(error)
        }
    }

    const update = async (data: Discount) => {
        try{
            const discount = await updateDiscount(data.id, data)
            fetchDiscounts()
        } catch (error) {
            console.log(error)
        }
    }

    const deleteRecord = async (id: string) => {
        try{
            const discount = await deleteDiscount(id)
            fetchDiscounts()
        } catch (error) {
            console.log(error)
        }
    }

    return {
        discounts,
        setDiscounts,
        fetchDiscounts,
        create,
        update,
        deleteRecord
    }
}