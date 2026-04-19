'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { sendNotice } from "@/app/dashboard/notices/actions"
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

export function SendNoticeDialog() {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!message) return

        startTransition(async () => {
            const result = await sendNotice(message)
            if (result?.error) {
                alert(result.error)
            } else {
                setOpen(false)
                setMessage("")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="w-full flex items-center p-3 rounded-lg border border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100 cursor-pointer transition-colors dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-200 dark:hover:bg-orange-900/50">
                    <AlertCircle className="mr-3 h-5 w-5 text-orange-500" />
                    <div>
                        <p className="text-sm font-medium">Send Important Notice</p>
                        <p className="text-xs text-orange-600/80 dark:text-orange-300/80 mt-0.5">Alert Admin immediately</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Send Notice to Admin</DialogTitle>
                        <DialogDescription>
                            This will securely popup on the Admin's dashboard. Use this for important or urgent messages.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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
                        <Button type="submit" disabled={isPending} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {isPending ? 'Sending...' : 'Send Notice'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
