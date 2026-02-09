
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Eye, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Candidate } from "@/types/candidate"
import Link from "next/link"

export const columns: ColumnDef<Candidate>[] = [
    {
        accessorKey: "passport_no",
        header: "Passport No",
        cell: ({ row }) => <div className="font-medium font-mono">{row.getValue("passport_no")}</div>,
    },
    {
        accessorKey: "full_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            let colorClass = "bg-slate-500"

            switch (status) {
                case "Registered": colorClass = "bg-blue-500 hover:bg-blue-600"; break;
                case "Medical": colorClass = "bg-yellow-500 hover:bg-yellow-600"; break;
                case "Visa": colorClass = "bg-purple-500 hover:bg-purple-600"; break;
                case "Completed": colorClass = "bg-green-500 hover:bg-green-600"; break;
            }

            return <Badge className={colorClass}>{status}</Badge>
        },
    },
    {
        accessorKey: "gender",
        header: "Gender",
    },
    {
        accessorKey: "contact_number",
        header: "Contact",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const candidate = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(candidate.passport_no)}
                        >
                            Copy Passport No
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/candidates/${candidate.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/candidates/${candidate.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
