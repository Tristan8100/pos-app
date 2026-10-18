export interface FetchStaff {
    id: string
    email: string
    full_name: string
    profile_path: string
    role: string
    created_at: string
}

export type StaffsDTO = Omit<FetchStaff, 'created_at' | 'profile_path' | 'id' | 'email'>

export type StaffCreateDTO = Pick<FetchStaff, 'email' | 'full_name' | 'role'> & { password: string }