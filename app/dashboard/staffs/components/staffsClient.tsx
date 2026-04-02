'use client'

import { useEffect, useState } from 'react'
import { fetchStaffs, updateStaff } from '../services/staffs.service'
import { FetchStaff } from '../types/staffs.types'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useStaffs } from '../hooks/staffs.hooks'

export default function StaffsClient() {
  const { staffs,
        loading,
        error,
        openEdit,
        selectedStaff,
        form,
        handleSaveEdit,
        loadStaffs,
        setOpenEdit,
        setSelectedStaff,
        setForm
    } = useStaffs()


  useEffect(() => {
    loadStaffs()
  }, [])

  const handleEditClick = (staff: FetchStaff) => {
    setSelectedStaff(staff)
    setForm({
      full_name: staff.full_name,
      email: staff.email,
      role: staff.role
    })
    setOpenEdit(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleRoleChange = (value: string) => {
    setForm({
      ...form,
      role: value
    })
  }

  if (loading) return <p>Loading staffs...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Staffs</h1>
      </div>

      {staffs.length === 0 ? (
        <p>No staffs found.</p>
      ) : (
        <ul className="space-y-2">
          {staffs.map((staff) => (
            <li key={staff.id} className="border p-3 rounded">
              <p><strong>Name:</strong> {staff.full_name}</p>
              <p><strong>Email:</strong> {staff.email}</p>
              <p><strong>Role:</strong> {staff.role}</p>

              <Button className="mt-2" onClick={() => handleEditClick(staff)}>
                Edit
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/*Edit Modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Full Name"
            />
            <Input value={form.email} disabled placeholder="Email" />
            <Select value={form.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cashier">Cashier</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}