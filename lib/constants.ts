
export const PROCESSING_STEPS = [
    "Registered",
    "Offer Letter",
    "Work Permit",
    "Police Report",
    "Travel Insurance",
    "Completed"
] as const

export type ProcessingStepType = typeof PROCESSING_STEPS[number]
