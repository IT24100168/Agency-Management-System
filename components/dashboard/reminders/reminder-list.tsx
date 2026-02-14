
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Clock, CheckCircle2 } from 'lucide-react'
import { deleteReminder } from '@/app/dashboard/reminders/actions'
import { Badge } from '@/components/ui/badge'

type Reminder = {
    id: string
    title: string
    dueDate: Date
}

function ReminderItem({ reminder }: { reminder: Reminder }) {
    const [timeLeft, setTimeLeft] = useState('')
    const [status, setStatus] = useState<'pending' | 'overdue'>('pending')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime()
            const due = new Date(reminder.dueDate).getTime()
            const distance = due - now

            if (distance < 0) {
                setStatus('overdue')
                const overdueBy = Math.abs(distance)
                const days = Math.floor(overdueBy / (1000 * 60 * 60 * 24))
                const hours = Math.floor((overdueBy % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

                if (days > 0) setTimeLeft(`Overdue by ${days}d ${hours}h`)
                else setTimeLeft(`Overdue by ${hours}h ${Math.floor((overdueBy % (1000 * 60 * 60)) / (1000 * 60))}m`)
                return
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

            if (days > 0) setTimeLeft(`${days}d ${hours}h left`)
            else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m left`)
            else setTimeLeft(`${minutes}m left`)
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

        return () => clearInterval(timer)
    }, [reminder.dueDate])

    const handleDelete = async () => {
        setIsDeleting(true)
        await deleteReminder(reminder.id)
        // Optimistic update handled by revalidatePath usually, but component might persist until refresh
        // Ideally we pass a callback to remove from parent state, but for now simple refresh
        setIsDeleting(false)
    }

    return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-slate-50 transition-colors">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <p className={`font-medium ${status === 'overdue' ? 'text-red-600' : ''}`}>{reminder.title}</p>
                    {status === 'overdue' && <Badge variant="destructive" className="text-[10px] h-5">Overdue</Badge>}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(reminder.dueDate).toLocaleString()}</span>
                    <span className="font-mono font-medium text-foreground">• {timeLeft}</span>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                onClick={handleDelete}
                disabled={isDeleting}
            >
                {isDeleting ? <span className="animate-spin">...</span> : <Trash2 className="h-4 w-4" />}
            </Button>
        </div>
    )
}

export function ReminderList({ reminders }: { reminders: Reminder[] }) {
    if (!reminders || reminders.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground text-sm">
                No active reminders.
            </div>
        )
    }

    return (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {reminders.map(reminder => (
                <ReminderItem key={reminder.id} reminder={reminder} />
            ))}
        </div>
    )
}
