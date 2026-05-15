'use client'
import ShiftList from "./components/shiftList";
import ShiftTransaction from "./components/shiftTransaction";

export default function MyShiftsPage() {
    return (
        <div>
            <h1>My Shifts</h1>
            <ShiftList />
            <ShiftTransaction />
        </div>
    );
}