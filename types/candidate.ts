
export type Candidate = {
    id: string
    full_name: string
    passport_no: string
    status: 'Registered' | 'Medical' | 'Visa' | 'Training' | 'Embassy' | 'Ticket' | 'Completed'
    gender: string
    dob?: string
    contact_number?: string
    agent_id?: string
    address?: string
    created_at: string
}
