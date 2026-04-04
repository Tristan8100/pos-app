import { createClient } from '@/lib/supabase/client'

export const supabase = createClient()


async function getAuthenticatedStaffId() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    throw new Error('Unauthorized: No active session found.')
  }
  return user.id
}

export async function startShift(startingCash: number = 0) {
  const staffId = await getAuthenticatedStaffId()

  const { data: existing, error: existingError } = await supabase
    .from('shifts')
    .select('*')
    .eq('staff_id', staffId)
    .eq('status', 'OPEN')
    .maybeSingle()

  if (existingError) throw new Error(existingError.message)
  if (existing) throw new Error('You already have an active shift')

  const { data, error } = await supabase
    .from('shifts')
    .insert({
      staff_id: staffId,
      starting_cash: startingCash,
      expected_cash: startingCash, //same value update expected cash later each transactions
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getActiveShift() {
  const staffId = await getAuthenticatedStaffId()

  const { data: shift, error } = await supabase
    .from('shifts')
    .select('*')
    .eq('staff_id', staffId)
    .eq('status', 'OPEN')
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!shift) return null

  const now = new Date()
  const start = new Date(shift.start_time)
  let warning: string | null = null

  const isSameDay =
    now.getFullYear() === start.getFullYear() &&
    now.getMonth() === start.getMonth() &&
    now.getDate() === start.getDate()

  if (!isSameDay) {
    warning = 'This shift was started on a previous day and is still open.'
  }

  const diffHours = (now.getTime() - start.getTime()) / (1000 * 60 * 60)
  if (diffHours > 16) {
    warning = 'Shift has been open for over 16 hours.'
  }

  return { shift, warning }
}

export async function endShift(shiftId: string, countedCash: number) {
  const staffId = await getAuthenticatedStaffId()

  // Fetch shift and ensure it belongs to the current user
  const { data: shift, error: shiftError } = await supabase
    .from('shifts')
    .select('*')
    .eq('id', shiftId)
    .eq('staff_id', staffId) // checking
    .eq('status', 'OPEN') //important
    .single()

  if (shiftError) throw new Error("Shift not found or access denied.")

  const { data, error } = await supabase
    .from('shifts')
    .update({
      end_time: new Date().toISOString(),
      status: 'CLOSED',
      counted_cash: countedCash,
      difference: shift.expected_cash - countedCash,
    })
    .eq('id', shiftId)
    .eq('staff_id', staffId) // checking
    .select()
    .single()

  if (error) throw new Error(error.message)

  return { ...data, countedCash }
}

export async function getShiftsByStaff(startDate?: string, endDate?: string) {
  const staffId = await getAuthenticatedStaffId()

  let query = supabase
    .from('shifts')
    .select('*')
    .eq('staff_id', staffId)
    .order('start_time', { ascending: false })

  if (startDate) query = query.gte('start_time', startDate)
  if (endDate) query = query.lte('start_time', endDate)

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return data
}

export async function getShiftSummary(shiftId: string) {
  const staffId = await getAuthenticatedStaffId()

  const { data: shift, error } = await supabase
    .from('shifts')
    .select('*')
    .eq('id', shiftId)
    .eq('staff_id', staffId)
    .single()

  if (error) throw new Error("Shift not found or access denied.")

  return shift
}