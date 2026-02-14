
'use client'

import { useState, useTransition } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Pencil } from "lucide-react"
import { assignAgent } from "../actions"
import { useRouter } from "next/navigation"

interface Agent {
    id: string
    name: string
}

interface AgentAssignmentProps {
    candidateId: string
    currentAgentId?: string | null
    agents: Agent[]
}

export function AgentAssignment({ candidateId, currentAgentId, agents }: AgentAssignmentProps) {
    const [open, setOpen] = useState(false)
    const [selectedAgentId, setSelectedAgentId] = useState<string>(currentAgentId || "")
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSave = () => {
        startTransition(async () => {
            const result = await assignAgent(candidateId, selectedAgentId)
            if (result.success) {
                setOpen(false)
                router.refresh()
            } else {
                alert("Failed to assign agent: " + result.error)
            }
        })
    }

    const currentAgentName = agents.find(a => a.id === currentAgentId)?.name || "Unassigned"

    return (
        <div className="flex items-center gap-2">
            <div className="text-sm">{currentAgentName}</div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Pencil className="h-3 w-3" />
                        <span className="sr-only">Edit Agent</span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Agent</DialogTitle>
                        <DialogDescription>
                            Select an agent to assign to this candidate.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Agent" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unassigned">Unassigned (Remove)</SelectItem>
                                {agents.map((agent) => (
                                    <SelectItem key={agent.id} value={agent.id}>
                                        {agent.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
