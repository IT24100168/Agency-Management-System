
'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Transaction = {
    id: string
    type: string
    amount: number
    description: string | null
    date: string
    candidateName?: string | null
}

export function AccountingTable({ data }: { data: Transaction[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                            No transactions found
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge variant={row.type === 'income' ? 'default' : 'destructive'}
                                    className={row.type === 'income' ? 'bg-green-600' : 'bg-red-600'}>
                                    {row.type}
                                </Badge>
                            </TableCell>
                            <TableCell>{row.description || '-'}</TableCell>
                            <TableCell>{row.candidateName || <span className="text-muted-foreground italic">General</span>}</TableCell>
                            <TableCell className={`text-right font-mono font-medium ${row.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {row.type === 'expense' ? '-' : '+'}Rs. {row.amount.toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
