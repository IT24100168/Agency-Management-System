
export type Agent = {
    id: string
    name: string
    type: 'sub-agent' | 'foreign'
    contact_info: {
        email?: string
        phone?: string
        address?: string
    } | null
    user_id?: string
    created_at: string
}
