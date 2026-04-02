export interface FetchStaff {
    id: string
    email: string
    full_name: string
    profile_path: string
    role: string
    created_at: string
}

export interface StaffsDTO extends Omit<FetchStaff, 'created_at' | 'profile_path' | 'id' | 'email'> {}