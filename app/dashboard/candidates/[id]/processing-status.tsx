
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Clock, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useTransition, useEffect } from "react"
import { toggleProcessingStep } from "./processing-actions"
import { useRouter } from "next/navigation"

interface ProcessingStep {
    id: string
    type: string
    status: string
    completion_date?: string | null
    notes?: string | null
}

interface ProcessingStatusProps {
    candidateId: string
    status: string
    steps: ProcessingStep[]
}

import { PROCESSING_STEPS } from "@/lib/constants"

export function ProcessingStatus({ candidateId, status, steps }: ProcessingStatusProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    // Local state for optimistic updates
    // We Map the array to a Map for easier lookup
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(() => {
        const set = new Set<string>()
        // Initialize from props
        steps.forEach(s => {
            if (s.status === 'Completed') set.add(s.type)
        })
        // Always ensuring "Registered" is conceptually completed if we are past it? 
        // Or just trust the DB? Let's trust DB but defaulting Registered if empty might be good UX
        // actually, let's trust the DB. If "Registered" is missing in DB, it will be unchecked. 
        // But usually usage implies it's checked.
        // Let's add a migration/presumption: if list is empty, maybe nothing is checked.
        // But for UX, let's just use the DB state.
        return set
    })

    // Calculate progress based on local state (only counting valid steps)
    const validCompletedCount = PROCESSING_STEPS.filter(step => completedSteps.has(step)).length
    const progress = Math.min(100, (validCompletedCount / PROCESSING_STEPS.length) * 100)

    const handleToggle = (step: string, checked: boolean) => {
        // Optimistic update
        setCompletedSteps(prev => {
            const next = new Set(prev)
            if (checked) {
                next.add(step)
            } else {
                next.delete(step)
            }
            return next
        })

        startTransition(async () => {
            const result = await toggleProcessingStep(candidateId, step, checked)
            if (!result.success) {
                // Revert on failure
                setCompletedSteps(prev => {
                    const next = new Set(prev)
                    if (checked) next.delete(step) // was checking, so remove
                    else next.add(step) // was unchecking, so add back
                    return next
                })
                alert("Failed to update step: " + result.error)
            } else {
                // Success: The page revalidation in action should update the "status" prop
                // causing a re-render from server data eventually.
                // But we keep local state for smoothness.
            }
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{Math.round(progress)}% Completed</span>
                        <span className="text-sm text-muted-foreground capitalize">Current Stage: {status}</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Workflow Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-0 pb-4">
                            {PROCESSING_STEPS.map((step, index) => {
                                const isCompleted = completedSteps.has(step)
                                const isCurrent = status === step // Determines highlighting? 
                                // Actually "Current Stage" usually means the *latest* completed step.

                                let icon = <Circle className="h-4 w-4 text-gray-400 bg-white dark:bg-gray-900" />
                                let textClass = "text-gray-500"

                                if (isCompleted) {
                                    icon = <CheckCircle2 className="h-5 w-5 text-green-500 bg-white dark:bg-gray-900" />
                                    textClass = "text-green-600 font-medium"
                                } else if (isCurrent) { // This condition might be weird if we can toggle out of order
                                    icon = <Clock className="h-5 w-5 text-blue-500 bg-white dark:bg-gray-900" />
                                    textClass = "text-blue-600 font-bold"
                                }

                                return (
                                    <div key={step} className="mb-8 ml-6 relative flex items-center justify-between group">
                                        <div className="flex items-center">
                                            <span className="absolute -left-[33px] bg-white dark:bg-gray-900">
                                                {icon}
                                            </span>
                                            <div>
                                                <h3 className={`text-base leading-tight ${textClass} transition-colors`}>{step}</h3>
                                                <p className="text-xs text-gray-400">
                                                    {isCompleted ? "Completed" : "Pending"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <Checkbox
                                                id={`step-${step}`}
                                                checked={isCompleted}
                                                onCheckedChange={(checked) => handleToggle(step, checked as boolean)}
                                                disabled={isPending}
                                                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                            />
                                            <label
                                                htmlFor={`step-${step}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2 sr-only"
                                            >
                                                Mark as complete
                                            </label>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
