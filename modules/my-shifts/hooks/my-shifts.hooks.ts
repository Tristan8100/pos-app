import { useEffect, useState } from "react"
import { getAllAuthUserShift, getZReading } from "../../shift/services/shift.service"
import { Shift } from "../../shift/types/shift.types"
import { ZReading } from "../../orders/types/orders.types"

export default function MyShiftsHooks(){
    const [shifts, setShifts] = useState<Shift[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)
    const [zReading, setZReading] = useState<ZReading []>([])//changeee

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

    const fetchZReading = async (shiftId: string) => {
        try {
            setLoading(true)
            const data = await getZReading(shiftId)
            console.log("Z READING", data)
            console.log(data)
            setZReading(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
        }
        
    }

    return {shifts, fetchShifts, setShifts, loading, error, fetchZReading, zReading, setZReading}
}