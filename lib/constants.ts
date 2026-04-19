
export const PROCESSING_STEPS = [
    "Registered",
    "Offer Letter",
    "Police Report",
    "Work Permit",
    "Travel Insurance",
    "Visa Apply",
    "Embassy Interview",
    "Visa Stamp",
    "Bureau",
    "Ticket",
    "Completed"
] as const

export type ProcessingStepType = typeof PROCESSING_STEPS[number]
