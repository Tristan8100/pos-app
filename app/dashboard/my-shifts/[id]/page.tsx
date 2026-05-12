'use client';

import { useEffect } from "react";
import { useParams } from "next/navigation";
import MyShiftsHooks from "../hooks/my-shifts.hooks";
import { Card } from "@/components/ui/card";

export default function MyShiftsPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    fetchZReading,
    zReading,
    loading,
    error,
  } = MyShiftsHooks();

  useEffect(() => {
    if (id) {
      fetchZReading(id);
    }
  }, [id]);

  return (
    <div>
      <h1>My Shifts {id}</h1>

      <div>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {zReading && zReading.length > 0 && (
        <div>
            {zReading.map((order) => (
            <Card key={order.id}>
                <p>ID: {order.id}</p>
                <p>Status: {order.status}</p>
                <p>Total: {order.total}</p>
                <p>Payment: {order.receivedPayment}</p>
                <p>Change: {order.givenChange}</p>
                <p>Shift: {order.shift_id}</p>
            </Card>
            ))}
        </div>
        )}
      </div>
    </div>
  );
}