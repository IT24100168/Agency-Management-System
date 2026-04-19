'use client'

import { useState, useEffect, useTransition } from "react"
import { AlertCircle, CheckCircle, Check } from "lucide-react"
import { resolveNotice, acknowledgeNotice } from "@/app/dashboard/notices/actions"

type Notice = {
    id: string
    message: string
    resolved: boolean
    createdAt: Date
    author?: { fullName: string | null }
}

export function NoticeBanners({ notices, isAdmin }: { notices: Notice[], isAdmin: boolean }) {
    const [visibleNotices, setVisibleNotices] = useState<Notice[]>([])
    const [isPending, startTransition] = useTransition()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        setVisibleNotices(notices)
    }, [notices])

    const handleAction = (id: string) => {
        // Optimistic UI hide
        setVisibleNotices(prev => prev.filter(n => n.id !== id))

        startTransition(async () => {
            if (isAdmin) {
                const res = await resolveNotice(id)
                if (res?.error) alert(res.error)
            } else {
                const res = await acknowledgeNotice(id)
                if (res?.error) alert(res.error)
            }
        })
    }

    if (!isMounted || visibleNotices.length === 0) return null

    return (
        <div className="flex flex-col gap-3 w-full mb-6">
            {visibleNotices.map(n => (
                <div key={n.id} className={`p-4 rounded-lg shadow-sm flex items-start justify-between transition-all animate-in fade-in slide-in-from-top-4 border ${isAdmin ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800' : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'}`}>
                    <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-4 ${isAdmin ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400' : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400'}`}>
                            {isAdmin ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                        </div>
                        <div className="mt-0.5">
                            <p className={`text-sm font-semibold ${isAdmin ? 'text-orange-900 dark:text-orange-100' : 'text-emerald-900 dark:text-emerald-100'}`}>
                                {isAdmin ? `Urgent Notice from Staff (${n.author?.fullName || 'Unknown'})` : 'Notice Resolved by Admin'}
                            </p>
                            <p className={`text-sm mt-1 whitespace-pre-wrap ${isAdmin ? 'text-orange-800 dark:text-orange-200' : 'text-emerald-800 dark:text-emerald-200'}`}>
                                {n.message}
                            </p>
                            <p className={`text-xs mt-2 opacity-70 ${isAdmin ? 'text-orange-700 dark:text-orange-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                                Sent on {new Date(n.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleAction(n.id)} 
                        disabled={isPending}
                        className={`flex items-center text-xs ml-4 whitespace-nowrap font-medium px-3 py-1.5 rounded-full transition-colors border ${isAdmin 
                            ? 'bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/50 dark:border-orange-700 dark:text-orange-200 dark:hover:bg-orange-800' 
                            : 'bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:border-emerald-700 dark:text-emerald-200 dark:hover:bg-emerald-800'}`}
                    >
                        <Check className="h-4 w-4 mr-1.5" />
                        {isAdmin ? 'Mark as Resolved' : 'Acknowledge'}
                    </button>
                </div>
            ))}
        </div>
    )
}
