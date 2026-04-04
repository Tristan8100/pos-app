"use client"

import { useEffect, useState } from "react"
import { useShift } from "../hooks/useShift"
import { startShift, endShift, getActiveShift } from '../services/shift.service'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ShiftClient() {
  const { activeShift, loading, refreshShift, handleStart, handleEnd, cash, setCash, submitting } = useShift()
  
  useEffect(() => { refreshShift() }, [])

  if (loading) return <div className="p-8 text-center">Loading shift status...</div>

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{activeShift ? "Active Shift" : "Clock In"}</CardTitle>
          <CardDescription>
            {activeShift 
              ? `Started at ${new Date(activeShift.start_time).toLocaleTimeString()}`
              : "Enter your starting cash to begin your shift."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cash">
              {activeShift ? "Counted Cash (End of Shift)" : "Starting Cash"}
            </Label>
            <Input
              id="cash"
              type="number"
              placeholder="0.00"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
            />
          </div>

          {activeShift && (
            <div className="p-3 bg-slate-100 rounded-md text-sm space-y-1">
              <div className="flex justify-between">
                <span>Start Cash:</span>
                <span className="font-mono">${activeShift.starting_cash}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-600 font-bold">{activeShift.status}</span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {activeShift ? (
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleEnd}
              disabled={submitting || !cash}
            >
              {submitting ? "Ending..." : "End Shift & Clock Out"}
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={handleStart}
              disabled={submitting}
            >
              {submitting ? "Starting..." : "Start Shift"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}