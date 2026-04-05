import { useEffect, useState } from "react"
import { getAllAuthUserShift } from "../services/shift.service"
import { Shift } from "../types/shift.types"

export default function ShiftList() {
    const [shifts, setShifts] = useState<Shift[] | null>([])

    useEffect(() => {
        fetchShifts()
    }, [])

    const fetchShifts = async () => {
        const shifts = await getAllAuthUserShift()
        setShifts(shifts)
    }

    return (
        <div>
            <h1>Shift</h1>
            <div>
                {shifts?.map((shift) => (
                    <div className="border " key={shift.id}>
                        <p>{shift.start_time}</p>
                        <p>{shift.end_time}</p>
                        <div>expected_cash: {shift.expected_cash}</div>
                    </div>
                ))}
            </div>

        </div>
    )
}