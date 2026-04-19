
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
import { Button } from "@/components/ui/button"
import { Trash2, FileText } from "lucide-react"
import { deleteTransaction } from "./actions"
import { useState } from "react"

type Transaction = {
    id: string
    type: string
    amount: number
    description: string | null
    date: string
    candidateName?: string | null
    documentUrl?: string | null
}

export function AccountingTable({ data }: { data: Transaction[] }) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you need to delete this transaction? This action cannot be undone.")) {
            setIsDeleting(id)
            const result = await deleteTransaction(id)
            setIsDeleting(null)
            if (result.error) {
                alert(result.error)
            }
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Doc</TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
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
                            <TableCell>
                                {row.documentUrl ? (
                                    <a href={row.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-full inline-block transition-colors">
                                        <FileText className="w-4 h-4" />
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground">-</span>
                                )}
                            </TableCell>
                            <TableCell>{row.candidateName || <span className="text-muted-foreground italic">General</span>}</TableCell>
                            <TableCell className={`text-right font-mono font-medium ${row.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {row.type === 'expense' ? '-' : '+'}Rs. {row.amount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(row.id)}
                                    disabled={isDeleting === row.id}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
