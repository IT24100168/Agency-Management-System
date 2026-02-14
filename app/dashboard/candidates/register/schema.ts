
import { z } from "zod"

export const candidateFormSchema = z.object({
    // 1. General
    full_name: z.string().min(2, "Full name is required"),
    registration_number: z.string().optional(),
    registration_date: z.string().optional(),
    name_with_initials: z.string().optional(),
    nic: z.string().optional(),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date of birth" }).optional(),
    age: z.coerce.number().optional(), // Coerce form string to number
    gender: z.string().optional(), // Changed to string to allow more flexibility or select
    photo: z.string().optional(), // URL

    // 2. Personal
    home_town: z.string().optional(),
    place_of_birth: z.string().optional(),
    gs_section: z.string().optional(),
    police_area: z.string().optional(),
    aga_division: z.string().optional(),
    nationality: z.string().optional(),
    religion: z.string().optional(),
    marital_status: z.string().optional(),
    contact_number: z.string().optional(),
    secondary_contact_number: z.string().optional(),
    address: z.string().optional(),
    weight: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
    children_count: z.coerce.number().optional(),

    // Guardian
    guardian_name: z.string().optional(),
    guardian_address: z.string().optional(),
    guardian_relationship: z.string().optional(),
    guardian_contact: z.string().optional(),

    // 3. Passport
    passport_no: z.string().min(5, "Passport number is required"),
    passport_issued_date: z.string().optional(),
    passport_exp_date: z.string().optional(),
    passport_place_issued: z.string().optional(),
    passport_status: z.string().optional(),

    // 4. Job
    job_country: z.string().optional(),
    job_post: z.string().optional(),
    job_salary: z.coerce.number().optional(),
    contract_period: z.string().optional(),
    experience: z.string().optional(),

    // 5. Remarks
    remarks: z.string().optional(),

    agent_id: z.string().optional(),
})

export type CandidateFormValues = z.infer<typeof candidateFormSchema>
