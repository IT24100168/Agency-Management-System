'use client'

import { useState, useEffect } from "react"
import { getNoticeHistory } from "@/app/dashboard/notices/actions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { History, CheckCircle, Info } from "lucide-react"

type NoticeHistoryItem = {
    id: string
    message: string
    createdAt: Date
    author: { fullName: string | null }
    targetUser: { fullName: string | null } | null
}

export function NoticeHistoryDialog({ isAdmin }: { isAdmin: boolean }) {
    const [open, setOpen] = useState(false)
    const [history, setHistory] = useState<NoticeHistoryItem[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setIsLoading(true)
            getNoticeHistory().then(data => {
                setHistory(data as any)
                setIsLoading(false)
            })
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="w-full flex items-center p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800">
                    <History className="mr-3 h-5 w-5 text-slate-500" />
                    <div>
                        <p className="text-sm font-medium">View Notice History</p>
                        <p className="text-xs text-slate-500 mt-0.5">Past resolved notices</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <History className="mr-2 h-5 w-5" />
                        Notice History
                    </DialogTitle>
                    <DialogDescription>
                        A log of all past securely resolved notices and alerts.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-3">
                    {isLoading ? (
                        <div className="text-center text-sm text-slate-500 py-8">Loading history...</div>
                    ) : history.length === 0 ? (
                        <div className="text-center text-sm text-slate-500 py-8 flex flex-col items-center">
                            <Info className="h-8 w-8 mb-2 opacity-50" />
                            No resolved notices found in your history.
                        </div>
                    ) : (
                        history.map(notice => (
                            <div key={notice.id} className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                                        {notice.targetUser === null 
                                            ? `From ${notice.author.fullName || 'Staff'} to Admins` 
                                            : `From ${notice.author.fullName || 'Admin'} to ${notice.targetUser.fullName || 'Staff'}`
                                        }
                                    </div>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(notice.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                                    {notice.message}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
