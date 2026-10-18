'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  UserPlus,
  Users
} from 'lucide-react'
import type { FetchStaff } from '../types/staffs.types'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageLayout } from '@/components/page-layout'
import { useStaffs } from '../hooks/staffs.hooks'

/* ----------------------------- UI helpers ----------------------------- */

const ROLE_STYLES: Record<string, string> = {
  admin: 'bg-primary/10 text-primary ring-primary/20',
  cashier: 'bg-muted text-muted-foreground ring-border'
}

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value
}

function getInitials(name: string) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function RoleBadge({ role }: { role: string }) {
  const style = ROLE_STYLES[role?.toLowerCase()] ?? ROLE_STYLES.cashier
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {capitalize(role)}
    </span>
  )
}

function InitialsAvatar({ name }: { name: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
    >
      {getInitials(name)}
    </div>
  )
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium leading-none">
      {children}
    </label>
  )
}

function SkeletonRows() {
  return (
    <div className="divide-y" aria-busy="true" aria-label="Loading staff">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4 sm:px-6">
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-40 animate-pulse rounded bg-muted" />
            <div className="h-3 w-56 animate-pulse rounded bg-muted" />
          </div>
          <div className="hidden h-5 w-16 animate-pulse rounded-full bg-muted sm:block" />
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
        </div>
      ))}
    </div>
  )
}

function FormError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

/* ------------------------------ Component ------------------------------ */

export default function StaffsClient() {
  const {
    staffs,
    loading,
    error,
    openEdit,
    openCreate,
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
    setCreateError
  } = useStaffs()

  // Local UI-only state
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    loadStaffs()
  }, [loadStaffs])

  // Roles are derived from the data itself, so nothing is hard coded
  const availableRoles = useMemo(
    () => Array.from(new Set(staffs.map((s) => s.role))).filter(Boolean),
    [staffs]
  )

  const filteredStaffs = useMemo(() => {
    const query = search.trim().toLowerCase()
    return staffs.filter((staff) => {
      const matchesRole = roleFilter === 'all' || staff.role === roleFilter
      const matchesSearch =
        query === '' ||
        staff.full_name?.toLowerCase().includes(query) ||
        staff.email?.toLowerCase().includes(query)
      return matchesRole && matchesSearch
    })
  }, [staffs, search, roleFilter])

  const isFiltering = search.trim() !== '' || roleFilter !== 'all'

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

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateForm({
      ...createForm,
      [e.target.name]: e.target.value
    })
  }

  const clearFilters = () => {
    setSearch('')
    setRoleFilter('all')
  }

  const renderBody = () => {
    if (loading) return <SkeletonRows />

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">Something went wrong</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => loadStaffs()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      )
    }

    if (staffs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Users className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">No staff members yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first team member to get started.
            </p>
          </div>
          <Button size="sm" onClick={() => setOpenCreate(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Staff
          </Button>
        </div>
      )
    }

    if (filteredStaffs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Search className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">No results found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or role filter.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )
    }

    return (
      <>
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-6 py-3">Staff</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStaffs.map((staff) => (
                <tr key={staff.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={staff.full_name} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{staff.full_name}</p>
                        <p className="truncate text-muted-foreground">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={staff.role} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(staff)}
                      aria-label={`Edit ${staff.full_name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ul className="divide-y md:hidden">
          {filteredStaffs.map((staff) => (
            <li key={staff.id} className="flex items-center gap-3 px-4 py-4">
              <InitialsAvatar name={staff.full_name} />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate font-medium">{staff.full_name}</p>
                <p className="truncate text-sm text-muted-foreground">{staff.email}</p>
                <RoleBadge role={staff.role} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditClick(staff)}
                aria-label={`Edit ${staff.full_name}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </>
    )
  }

  const showToolbar = !loading && !error && staffs.length > 0

  return (
    <>
    <PageLayout
      title="Staff"
      description="Manage team members and their access."
      badge={
        !loading && !error ? (
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {staffs.length} {staffs.length === 1 ? 'member' : 'members'}
          </span>
        ) : null
      }
      actions={
        <Button onClick={() => setOpenCreate(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Create Staff
        </Button>
      }
    >
      {showToolbar && (
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:px-6">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              aria-label="Search staff"
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger aria-label="Filter by role" className="w-full sm:w-44">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {capitalize(role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {renderBody()}

      {showToolbar && filteredStaffs.length > 0 && isFiltering && (
        <div className="border-t bg-muted/30 px-6 py-3 text-xs text-muted-foreground">
          Showing {filteredStaffs.length} of {staffs.length}
        </div>
      )}
    </PageLayout>

      {/* Create dialog */}
      <Dialog
        open={openCreate}
        onOpenChange={(open) => {
          setOpenCreate(open)
          if (!open) {
            setCreateError(null)
            setShowPassword(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create staff</DialogTitle>
            <DialogDescription>
              Add a new team member and choose what they can access.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleCreateStaff()
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <FieldLabel htmlFor="create-full-name">Full name</FieldLabel>
              <Input
                id="create-full-name"
                name="full_name"
                value={createForm.full_name}
                onChange={handleCreateChange}
                placeholder="Full name"
                required
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="create-email">Email</FieldLabel>
              <Input
                id="create-email"
                name="email"
                type="email"
                value={createForm.email}
                onChange={handleCreateChange}
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="create-password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="create-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={createForm.password}
                  onChange={handleCreateChange}
                  placeholder="Password"
                  autoComplete="new-password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="create-role">Role</FieldLabel>
              <Select
                value={createForm.role}
                onValueChange={(role) => setCreateForm({ ...createForm, role })}
              >
                <SelectTrigger id="create-role" aria-label="Staff role" className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {createError && <FormError message={createError} />}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenCreate(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {creating ? 'Creating...' : 'Create staff'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit staff</DialogTitle>
            <DialogDescription>
              Update this team member&apos;s name or role.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveEdit()
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <FieldLabel htmlFor="edit-full-name">Full name</FieldLabel>
              <Input
                id="edit-full-name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="edit-email">Email</FieldLabel>
              <Input id="edit-email" value={form.email} disabled placeholder="Email" />
              <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="edit-role">Role</FieldLabel>
              <Select value={form.role} onValueChange={handleRoleChange}>
                <SelectTrigger id="edit-role" className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}