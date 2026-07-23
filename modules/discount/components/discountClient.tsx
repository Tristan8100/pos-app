'use client'
import CreateDiscount from "./createDiscount";
import useDiscounts from "../hooks/useDiscounts";
import { useEffect } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import EditDiscount from "./editDiscount";
import { Button } from "@/components/ui/button";
import { DeleteDiscount } from "./deleteDiscount";

export default function DiscountClient() {
    const { fetchDiscounts, create, update, deleteRecord } = useDiscounts();
    const discounts = useSelector((state: RootState) => state.discount.value) ?? [];

    useEffect(() => {
        fetchDiscounts(true);
    }, []);


    return (
        <div>
            <h1>Discounts Component</h1>
            {discounts && discounts.length > 0 ? (
                discounts.map((discount) => (
                    <div className="border bg-slate-200 w-1/2 flex items-center justify-between" key={discount.id}>
                        {discount.name} {discount.discount}
                     <EditDiscount data={discount} update={update} />
                     <DeleteDiscount id={discount.id} onDelete={() => deleteRecord(discount.id)}/>
                    </div>
                ))
            ) : (
                <div>No discount</div>
            )}
            <CreateDiscount create={create} />
        </div>
    );
}