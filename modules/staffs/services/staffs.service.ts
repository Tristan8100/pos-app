import { createClient } from '@/lib/supabase/client'
import { FetchStaff, StaffCreateDTO, StaffsDTO } from '../types/staffs.types'
const BUCKET = 'pos-bucker'

export const supabase = createClient()

export const fetchStaffs = async () => {
  const { data, error } = await supabase
    .from('users')
    .select(`*`)

  if (error) {
    console.error('Error fetching staffs:', error.message)
    throw new Error(error.message)
  }

  console.log('Staffs data:', data)

  return data || []
}

export const fetchOneStaff = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select(`*`)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching staff:', error.message)
    throw new Error(error.message)
  }

  console.log('Staff data:', data)

  return data || {}
}

export const updateStaff = async (id: string, data: StaffsDTO) => {
  const { data: updatedData, error } = await supabase
    .from('users')
    .update(data)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error updating staff:', error.message)
    throw new Error(error.message)
  }

  console.log('Updated staff data:', updatedData)

  return updatedData || {}
}

export const deleteStaff = async (id: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting staff:', error.message)
    throw new Error(error.message)
  }
}


export const createStaff = async (data: StaffCreateDTO) => {
  const { email, password, full_name, role } = data

  const existingStaff = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existingStaff.data) {
    throw new Error('A staff member with this email already exists.')
  }

  // 1. Create the Supabase Auth account
  const { data: authData, error: authError } =
    await supabase.auth.signUp({
      email,
      password,
    })

  if (authError) {
    console.error('Error creating staff account:', authError.message)
    throw new Error(authError.message)
  }

  const userId = authData.user?.id

  if (!userId) {
    throw new Error('Failed to retrieve the new user ID')
  }

  // 2. Insert the staff details using the Auth user's ID
  const { data: createdData, error: staffError } = await supabase
    .from('users')
    .insert({
      id: userId,
      email,
      full_name,
      role,
    })
    .select()
    .single()

  if (staffError) {
    console.error('Error creating staff details:', staffError.message)
    throw new Error(staffError.message)
  }

  return createdData as FetchStaff
}

//Auth Staff
export const fetchAuthStaff = async () => {
  const { data: { user } } = await supabase.auth.getUser()

  const id = user?.id

  return fetchOneStaff(id as string)
}