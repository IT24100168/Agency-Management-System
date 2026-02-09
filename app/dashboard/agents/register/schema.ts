
import { z } from "zod"

export const agentFormSchema = z.object({
    name: z.string().min(2, {
        message: "Agent name must be at least 2 characters.",
    }),
    type: z.enum(["sub-agent", "foreign"]),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(5, "Contact number is required"),
    address: z.string().optional(),
})

export type AgentFormValues = z.infer<typeof agentFormSchema>
