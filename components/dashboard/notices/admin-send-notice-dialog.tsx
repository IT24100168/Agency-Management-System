'use client'

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sendNoticeToStaff, getStaffUsers } from "@/app/dashboard/notices/actions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdminSendNoticeDialog() {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [targetUserId, setTargetUserId] = useState("")
    const [staffUsers, setStaffUsers] = useState<{id: string, fullName: string | null, email: string}[]>([])
    const [isPending, startTransition] = useTransition()

    // Fetch staff users when dialog opens
    useEffect(() => {
        if (open && staffUsers.length === 0) {
            getStaffUsers().then(users => setStaffUsers(users))
        }
    }, [open, staffUsers.length])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!message || !targetUserId) return

        startTransition(async () => {
            const result = await sendNoticeToStaff(message, targetUserId)
            if (result?.error) {
                alert(result.error)
            } else {
                setOpen(false)
                setMessage("")
                setTargetUserId("")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="w-full flex items-center p-3 rounded-lg border border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 cursor-pointer transition-colors dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-200 dark:hover:bg-purple-900/50">
                    <AlertCircle className="mr-3 h-5 w-5 text-purple-500" />
                    <div>
                        <p className="text-sm font-medium">Notify Staff</p>
                        <p className="text-xs text-purple-600/80 dark:text-purple-300/80 mt-0.5">Send alert to specific staff</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Send Notice to Staff</DialogTitle>
                        <DialogDescription>
                            This will securely popup on the targeted staff member's dashboard.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Select value={targetUserId} onValueChange={setTargetUserId} required disabled={isPending}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Staff Member" />
                            </SelectTrigger>
                            <SelectContent>
                                {staffUsers.map(user => (
                                    <SelectItem key={user.id} value={user.id}>{user.fullName || user.email}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Textarea
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            disabled={isPending}
                            className="resize-none"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-purple-600 hover:bg-purple-700 text-white">
                            {isPending ? 'Sending...' : 'Send Notice'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
