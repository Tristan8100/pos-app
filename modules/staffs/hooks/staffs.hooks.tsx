import { useCallback, useState } from "react"
import type { FetchStaff, StaffCreateDTO } from "../types/staffs.types"
import { createStaff, fetchStaffs, updateStaff, fetchAuthStaff } from "../services/staffs.service"

const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'An unexpected error occurred.'

export function useStaffs() {
    const [staffs, setStaffs] = useState<FetchStaff[]>([])
    const [authStaff, setAuthStaff] = useState<FetchStaff | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // modal state
    const [openEdit, setOpenEdit] = useState(false)
    const [openCreate, setOpenCreate] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState<FetchStaff | null>(null)
    const [creating, setCreating] = useState(false)
    const [createError, setCreateError] = useState<string | null>(null)
    const [createForm, setCreateForm] = useState<StaffCreateDTO>({
      full_name: '',
      email: '',
      role: '',
      password: ''
    })

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
        } catch (err) {
        setError(getErrorMessage(err))
        } finally {
        setOpenEdit(false)
        }
    }

    const handleCreateStaff = async () => {
      if (
        !createForm.full_name.trim() ||
        !createForm.email.trim() ||
        !createForm.role ||
        !createForm.password
      ) {
        setCreateError('Please complete all fields.')
        return
      }

      setCreating(true)
      setCreateError(null)
      try {
        await createStaff({
          full_name: createForm.full_name.trim(),
          email: createForm.email.trim(),
          role: createForm.role,
          password: createForm.password
        })
        await loadStaffs()
        setCreateForm({ full_name: '', email: '', role: '', password: '' })
        setOpenCreate(false)
      } catch (err) {
        setCreateError(getErrorMessage(err))
      } finally {
        setCreating(false)
      }
    }

    const loadStaffs = useCallback(async () => {
      try {
        const data = await fetchStaffs()
        setStaffs(data)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }, [])

    const loadAuthStaff = async () => {
      try {
        const data = await fetchAuthStaff()
        setAuthStaff(data)
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    //console.log(authStaff)

    return {
        staffs,
        loading,
        error,
        openEdit,
        openCreate,
        selectedStaff,
        form,
        createForm,
        creating,
        createError,
        handleSaveEdit,
        handleCreateStaff,
        loadStaffs,
        setOpenEdit,
        setOpenCreate,
        setSelectedStaff,
        setForm,
        setCreateForm,
        setCreateError,
        authStaff,
        loadAuthStaff
    }
}
