import { createClient } from '@/lib/supabase/client'
import { StaffsDTO } from '../types/staffs.types'
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

export const createStaff = async (data: any) => {
  const { data: createdData, error } = await supabase
    .from('users')
    .insert(data)
    .single()

  if (error) {
    console.error('Error creating staff:', error.message)
    throw new Error(error.message)
  }

  console.log('Created staff data:', createdData)

  return createdData || {}
}