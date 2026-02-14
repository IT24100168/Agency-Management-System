
'use client'

import { useState } from 'react'
import { useActionState } from 'react' // or useFormState pending Next.js version
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BellPlus } from 'lucide-react'
import { addReminder } from '@/app/dashboard/reminders/actions'
import { useFormStatus } from 'react-dom'

const initialState = {
    error: '',
    success: ''
} as { error: string, success?: never } | { success: string, error?: never } | { error: '', success: '' }

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Set Reminder"}
        </Button>
    )
}

export function AddReminderDialog() {
    const [open, setOpen] = useState(false)
    const [state, formAction] = useActionState(addReminder, initialState)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                    <BellPlus className="h-4 w-4" />
                    Set Reminder
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set a Reminder</DialogTitle>
                    <DialogDescription>
                        Receive an alert at a specific time.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="e.g. Call Candidate X" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="dueDate">Date & Time</Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="datetime-local"
                            required
                        // Default to tomorrow same time? Or just empty
                        />
                    </div>

                    {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
                    {state?.success && <p className="text-sm text-green-500">{state.success}</p>}

                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
