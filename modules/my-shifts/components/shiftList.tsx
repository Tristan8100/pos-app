import { useEffect, useState } from "react"
import { getAllAuthUserShift } from "../../shift/services/shift.service"
import { Shift } from "../../shift/types/shift.types"
import MyShiftsHooks from "../hooks/my-shifts.hooks"
import Link from "next/link"

export default function ShiftList() {
    const {shifts, fetchShifts, setShifts, loading, error} = MyShiftsHooks()

    const formatDate = (date?: string) => {
        if (!date) return "—"
        return new Date(date).toLocaleString()
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Shifts</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {shifts.map((shift) => (
                    <div
                        key={shift.id}
                        className="border rounded-2xl p-4 shadow-sm bg-white hover:shadow-md transition"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-500">
                                ID: {shift.id.slice(0, 8)}
                            </span>

                            <span
                                className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                    shift.status === "OPEN"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                {shift.status}
                            </span>
                        </div>

                        {/* Time */}
                        <div className="mb-3 text-sm">
                            <p><strong>Start:</strong> {formatDate(shift.start_time)}</p>
                            <p><strong>End:</strong> {formatDate(shift.end_time)}</p>
                        </div>

                        {/* Cash Info */}
                        <div className="space-y-1 text-sm">
                            <p>
                                <span className="text-gray-500">Starting:</span>{" "}
                                <span className="font-medium">₱{shift.starting_cash}</span>
                            </p>

                            <p>
                                <span className="text-gray-500">Expected:</span>{" "}
                                <span className="font-medium">
                                    ₱{shift.expected_cash ?? 0}
                                </span>
                            </p>

                            <p>
                                <span className="text-gray-500">Counted:</span>{" "}
                                <span className="font-medium">
                                    ₱{shift.counted_cash ?? 0}
                                </span>
                            </p>

                            <p>
                                <span className="text-gray-500">Difference:</span>{" "}
                                <span
                                    className={`font-semibold ${
                                        (shift.difference ?? 0) < 0
                                            ? "text-red-600"
                                            : "text-green-600"
                                    }`}
                                >
                                    ₱{shift.difference ?? 0}
                                </span>
                            </p>
                            <Link className="text-blue-500" href={`/dashboard/my-shifts/${shift.id}`}>View Shift</Link>
                        </div>
                    </div>
                ))}
            </div>

            {shifts.length === 0 && (
                <p className="text-gray-500 mt-4">No shifts found.</p>
            )}
        </div>
    )
}