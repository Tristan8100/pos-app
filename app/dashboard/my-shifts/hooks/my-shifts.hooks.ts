import { useEffect, useState } from "react"
import { getAllAuthUserShift } from "../../shift/services/shift.service"
import { Shift } from "../../shift/types/shift.types"

export default function MyShiftsHooks(){
    const [shifts, setShifts] = useState<Shift[]>([])

    useEffect(() => {
        fetchShifts()
    }, [])

    const fetchShifts = async () => {
        const data = await getAllAuthUserShift()
        setShifts(data)
    }

    return {shifts, fetchShifts, setShifts}
}