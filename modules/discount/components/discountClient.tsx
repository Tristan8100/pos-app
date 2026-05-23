'use client'
import CreateDiscount from "./createDiscount";
import useDiscounts from "../hooks/useDiscounts";
import { useEffect } from "react";

export default function DiscountClient() {
    const { discounts, fetchDiscounts, create } = useDiscounts();

    useEffect(() => {
        fetchDiscounts();
    }, []);

    console.log(discounts)

    return (
        <div>

            <h1>Discounts Component</h1>
            {discounts && discounts.length > 0 ? (
                discounts.map((discount) => (
                    <div key={discount.id}>{discount.name} {discount.discount}</div>
                ))
            ) : (
                <div>No discount</div>
            )}
            <CreateDiscount create={create} />
        </div>
    );
}