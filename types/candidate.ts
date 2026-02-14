export type Candidate = {
    id: string
    registration_number?: string | null
    full_name: string
    name_with_initials?: string | null
    nic?: string | null
    dob?: string | null // ISO Date string
    age?: number | null
    gender?: string | null
    photo?: string | null

    // Personal
    home_town?: string | null
    place_of_birth?: string | null
    gs_section?: string | null
    police_area?: string | null
    aga_division?: string | null
    nationality?: string | null
    religion?: string | null
    marital_status?: string | null
    contact_number?: string | null
    secondary_contact_number?: string | null
    address?: string | null
    weight?: number | null // Decimal to number
    height?: number | null
    children_count?: number | null

    // Guardian
    guardian_name?: string | null
    guardian_address?: string | null
    guardian_relationship?: string | null
    guardian_contact?: string | null

    // Passport
    passport_no: string
    passport_issued_date?: string | null
    passport_exp_date?: string | null
    passport_place_issued?: string | null
    passport_status?: string | null

    // Job
    job_country?: string | null
    job_post?: string | null
    job_salary?: number | null
    contract_period?: string | null
    experience?: string | null

    // Other
    remarks?: string | null

    status: string // 'Registered' | 'Medical' | ... (keeping string for flexibility as per schema)
    processing_steps?: {
        id: string
        type: string
        status: string
        notes?: string | null
        completion_date?: string | null
    }[]
    agent_id?: string | null
    created_at: string
    has_initial_payment?: boolean
}
