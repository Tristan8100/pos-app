import { useEffect, useState } from "react"
import { getAllAuthUserShift } from "../../shift/services/shift.service"
import { Shift } from "../../shift/types/shift.types"

export default function MyShiftsHooks(){
    const [shifts, setShifts] = useState<Shift[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        fetchShifts()
        
    }, [])

    const fetchShifts = async () => {
        try {
            setLoading(true)
            const data = await getAllAuthUserShift()
            setShifts(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
        }
        
    }

    return {shifts, fetchShifts, setShifts, loading, error}
}