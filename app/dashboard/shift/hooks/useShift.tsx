// hooks/use-shift.ts
import { useState, useEffect } from 'react'
import { startShift, endShift, getActiveShift } from '../services/shift.service'
import { Shift } from '../types/shift.types'


export function useShift() {
  const [activeShift, setActiveShift] = useState<Shift | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cash, setCash] = useState("")

  const refreshShift = async () => {
    setLoading(true)
    try {
      const { shift } = await getActiveShift() || {}
      setActiveShift(shift)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStart = async () => {
    setSubmitting(true)
    try {
      await startShift(Number(cash) || 0)
      //toast.success("Shift started!")
      refreshShift()
    } catch (err: any) {
      //toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEnd = async () => {
    if (!activeShift) return
    setSubmitting(true)
    try {
      await endShift(activeShift.id, Number(cash) || 0)
      //toast.success("Shift ended and closed.")
      setCash("")
      refreshShift()
    } catch (err: any) {
      //toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return { activeShift, loading, refreshShift, handleStart, handleEnd, cash, setCash, submitting }
}