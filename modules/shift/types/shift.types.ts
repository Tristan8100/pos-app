export type Shift = {
  id: string
  start_time: string
  end_time?: string
  status: 'OPEN' | 'CLOSED'
  starting_cash: number
  expected_cash?: number
  counted_cash?: number
  difference?: number
}