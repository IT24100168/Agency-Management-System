
import { getAgent } from "../actions"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil, ArrowLeft } from "lucide-react"

type Params = Promise<{ id: string }>

export default async function AgentDetailPage(props: { params: Params }) {
    const params = await props.params;
    const agent = await getAgent(params.id)

    if (!agent) {
        notFound()
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between mb-6">
                <Link href="/dashboard/agents">
                    <Button variant="ghost">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agents
                    </Button>
                </Link>
                <Link href={`/dashboard/agents/${agent.id}/edit`}>
                    <Button>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Agent
                    </Button>
                </Link>
            </div>

            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">{agent.name}</CardTitle>
                    <CardDescription className="capitalize">Type: {agent.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                            <p className="text-lg">{agent.contact_info?.email || "-"}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                            <p className="text-lg">{agent.contact_info?.phone || "-"}</p>
                        </div>
                        <div className="md:col-span-2">
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                            <p className="text-lg whitespace-pre-wrap">{agent.contact_info?.address || "-"}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Registered On</h3>
                            <p>{new Date(agent.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Assigned Candidates</h3>
                <Suspense fallback={<div>Loading candidates...</div>}>
                    <AgentCandidatesList agentId={agent.id} />
                </Suspense>
            </div>
        </div>
    )
}

import { getAgentCandidates } from "../actions"
import { Suspense } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

async function AgentCandidatesList({ agentId }: { agentId: string }) {
    const candidates = await getAgentCandidates(agentId)

    if (candidates.length === 0) {
        return <div className="text-muted-foreground">No candidates assigned to this agent.</div>
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reg No</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Passport</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {candidates.map((candidate) => (
                            <TableRow key={candidate.id}>
                                <TableCell className="font-medium">{candidate.registration_number}</TableCell>
                                <TableCell>{candidate.full_name}</TableCell>
                                <TableCell>{candidate.status}</TableCell>
                                <TableCell>{candidate.passport_status}</TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/dashboard/candidates/${candidate.id}`}>
                                        <Button variant="outline" size="sm">View</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
