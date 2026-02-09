
import { getCandidates } from "./actions"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function CandidatesPage() {
    const data = await getCandidates()

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Candidates</h2>
                    <p className="text-muted-foreground">
                        Manage and track all registered candidates here.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/dashboard/candidates/register">
                            <Plus className="mr-2 h-4 w-4" /> Register Candidate
                        </Link>
                    </Button>
                </div>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
