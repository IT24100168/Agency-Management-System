
'use client'

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { addTransaction } from "./finance-actions"
import { PlusCircle, ArrowDownCircle, ArrowUpCircle } from "lucide-react"

type Transaction = {
    id: string
    type: string
    amount: number
    description: string | null
    created_at: string
}

export function FinanceLedger({ candidateId, transactions }: { candidateId: string, transactions: Transaction[] }) {
    const [isPending, startTransition] = useTransition()

    // Calculate Balance
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpense

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 flex items-center">
                            <ArrowDownCircle className="mr-2 h-5 w-5" />
                            Rs. {totalIncome.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 flex items-center">
                            <ArrowUpCircle className="mr-2 h-5 w-5" />
                            Rs. {totalExpense.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                <Card className={balance >= 0 ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10"}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-700" : "text-red-700"}`}>
                            Rs. {balance.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                            No transactions recorded yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((t) => (
                                        <TableRow key={t.id}>
                                            <TableCell>{new Date(t.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>{t.description || '-'}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {t.type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {t.type === 'expense' ? '-' : '+'}Rs. {t.amount.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Add Entry</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={(formData) => {
                            startTransition(async () => {
                                await addTransaction(formData)
                                // Reset form logic would go here, simplified for now
                            })
                        }} className="space-y-4">
                            <input type="hidden" name="candidate_id" value={candidateId} />

                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select name="type" defaultValue="income">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Income (Payment In)</SelectItem>
                                        <SelectItem value="expense">Expense (Cost Out)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Amount (Rs.)</Label>
                                <Input name="amount" type="number" step="0.01" required placeholder="0.00" />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input name="description" required placeholder="e.g. Visa Fee" />
                            </div>

                            <Button type="submit" className="w-full" disabled={isPending}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
