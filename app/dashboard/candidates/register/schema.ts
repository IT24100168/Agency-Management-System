
import { z } from "zod"

export const candidateFormSchema = z.object({
    full_name: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    passport_no: z.string().min(5, {
        message: "Passport number is required.",
    }),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date of birth",
    }),
    gender: z.enum(["Male", "Female", "Other"]),
    contact_number: z.string().min(5, "Contact number is required"),
    address: z.string().optional(),
    agent_id: z.string().optional(), // In real app, this would be a select
    // Add other 20+ fields as needed, keeping it simple for MVP
})

export type CandidateFormValues = z.infer<typeof candidateFormSchema>
