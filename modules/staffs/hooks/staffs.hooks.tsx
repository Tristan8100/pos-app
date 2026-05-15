import { useState } from "react"
import { FetchStaff } from "../types/staffs.types"
import { fetchStaffs, updateStaff } from "../services/staffs.service"

export function useStaffs() {
    const [staffs, setStaffs] = useState<FetchStaff[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // modal state
    const [openEdit, setOpenEdit] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState<FetchStaff | null>(null)

    const [form, setForm] = useState({
    full_name: '',
    email: '',
    role: ''
    })

    const handleSaveEdit = async () => {
    if (!selectedStaff) return
        try {
        await updateStaff(selectedStaff.id, { full_name: form.full_name, role: form.role })
        loadStaffs()
        } catch (err: any) {
        setError(err.message)
        } finally {
        setOpenEdit(false)
        }
    }

    const loadStaffs = async () => {
    try {
      const data = await fetchStaffs()
      setStaffs(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

    return {
        staffs,
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
    }
}
