
import { Suspense } from 'react'
import { getAgents } from './actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/data-table-components"

import { AgentActions } from './agent-actions'

async function AgentsTable() {
    const agents = await getAgents()

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {agents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No agents found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        agents.map((agent) => (
                            <TableRow key={agent.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/dashboard/agents/${agent.id}`} className="hover:underline">
                                        {agent.name}
                                    </Link>
                                </TableCell>
                                <TableCell className="capitalize">{agent.type}</TableCell>
                                <TableCell>
                                    {agent.contact_info ? (
                                        <div className="flex flex-col text-sm">
                                            <span>{(agent.contact_info as any).email}</span>
                                            <span>{(agent.contact_info as any).phone}</span>
                                        </div>
                                    ) : '-'}
                                </TableCell>
                                <TableCell>{new Date(agent.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <AgentActions agent={agent as any} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default function AgentsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/agents/register">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Agent
                        </Button>
                    </Link>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Agent Directory</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading agents...</div>}>
                        <AgentsTable />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
