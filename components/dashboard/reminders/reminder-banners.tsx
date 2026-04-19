'use client'

import { useState, useEffect } from "react"
import { BellRing, X } from "lucide-react"

type Reminder = {
    id: string
    title: string
    dueDate: Date
}

export function ReminderBanners({ reminders }: { reminders: Reminder[] }) {
    const [visibleReminders, setVisibleReminders] = useState<Reminder[]>([])
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        
        // Show all reminders that exist in the database for this user
        setVisibleReminders(reminders)
    }, [reminders])

    const dismiss = (id: string) => {
        setVisibleReminders(prev => prev.filter(r => r.id !== id))
    }

    if (!isMounted || visibleReminders.length === 0) return null

    return (
        <div className="flex flex-col gap-3 w-full mb-6">
            {visibleReminders.map(r => (
                <div key={r.id} className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 p-4 rounded-lg shadow-sm flex items-start justify-between transition-all animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-start">
                        <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full mr-4">
                            <BellRing className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="mt-0.5">
                            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">Reminder</p>
                            <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">{r.title}</p>
                            <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1.5 flex items-center">
                                <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 mr-1.5"></span>
                                Due: {new Date(r.dueDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => dismiss(r.id)} 
                        className="text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 p-1.5 rounded-full transition-colors dark:hover:bg-indigo-900 dark:hover:text-indigo-300"
                        aria-label="Close reminder"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            ))}
        </div>
    )
}
