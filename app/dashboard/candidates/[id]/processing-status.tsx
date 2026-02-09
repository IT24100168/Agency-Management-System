
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Clock } from "lucide-react"

export function ProcessingStatus({ status }: { status: string }) {
    // Define steps and calculate progress based on status
    const steps = ["Registered", "Medical", "Training", "Visa", "Embassy", "Ticket", "Completed"]
    const currentStepIndex = steps.indexOf(status)
    const progress = ((currentStepIndex + 1) / steps.length) * 100

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{Math.round(progress)}% Completed</span>
                        <span className="text-sm text-muted-foreground">Current Stage: {status}</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Workflow Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-8 pb-4">
                            {steps.map((step, index) => {
                                let icon = <Circle className="h-4 w-4 text-gray-400 bg-white dark:bg-gray-900" />
                                let textClass = "text-gray-500"

                                if (index < currentStepIndex) {
                                    icon = <CheckCircle2 className="h-5 w-5 text-green-500 bg-white dark:bg-gray-900" />
                                    textClass = "text-green-600 font-medium"
                                } else if (index === currentStepIndex) {
                                    icon = <Clock className="h-5 w-5 text-blue-500 bg-white dark:bg-gray-900" />
                                    textClass = "text-blue-600 font-bold"
                                }

                                return (
                                    <div key={step} className="mb-4 ml-6 relative">
                                        <span className="absolute -left-[33px] mt-1 bg-white dark:bg-gray-900">
                                            {icon}
                                        </span>
                                        <h3 className={`text-base leading-tight ${textClass}`}>{step}</h3>
                                        <p className="text-sm text-gray-400">
                                            {index < currentStepIndex ? "Completed" : index === currentStepIndex ? "In Progress" : "Pending"}
                                        </p>
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
