import { getDiscount, createDiscount, updateDiscount, deleteDiscount } from "../services/discount.service";
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { setDiscountValue } from '../feature/store';
import { Discount, DiscountCreate } from "../types/discount.types";

export default function useDiscounts() {
    const discountState = useSelector((state: RootState) => state.discount.value);
    const dispatch = useDispatch();
    const [discounts, setDiscounts] = useState<Discount[]>([])

    const fetchDiscounts = async (isRedux?: boolean) => {
        try {
            const discounts = await getDiscount()
            if (isRedux) {
                dispatch(setDiscountValue(discounts))
            } else {
                setDiscounts(discounts)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const create = async (data: DiscountCreate) => {
        try{
            await createDiscount(data)
            fetchDiscounts(true)
        } catch (error) {
            console.log(error)
        }
    }

    const update = async (data: Discount) => {
        try{
            await updateDiscount(data.id, data)
            fetchDiscounts(true)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteRecord = async (id: string) => {
        try{
            await deleteDiscount(id)
            fetchDiscounts(true)
        } catch (error) {
            console.log(error)
        }
    }

    return {
        discountState,
        discounts,
        setDiscounts,
        fetchDiscounts,
        create,
        update,
        deleteRecord
    }
}
