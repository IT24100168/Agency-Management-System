
import { getCandidate } from "./actions"
import { getTransactions } from "./finance-actions"
import { getDocuments } from "./document-actions"
import { getAgents } from "../../agents/actions"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CandidateInfo } from "./candidate-info"
import { ProcessingStatus } from "./processing-status"
import { FinanceLedger } from "./finance-ledger"
import { DocumentsList } from "./documents-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"

// Type fix for Next.js 15 params
type Params = Promise<{ id: string }>

export default async function CandidateDetailPage(props: { params: Params }) {
    const params = await props.params;
    const candidate = await getCandidate(params.id)
    const transactions = await getTransactions(params.id)
    const documents = await getDocuments(params.id)
    const agents = await getAgents()

    if (!candidate) {
        notFound()
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/candidates">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">{candidate.full_name}</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href={`/dashboard/candidates/${candidate.id}/print`} target="_blank">
                        <Button variant="outline">
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                    </Link>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="processing">Processing</TabsTrigger>
                    <TabsTrigger value="finance">Finance</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <CandidateInfo candidate={candidate} agents={agents} />
                </TabsContent>

                <TabsContent value="processing" className="space-y-4">
                    <ProcessingStatus
                        candidateId={candidate.id}
                        status={candidate.status}
                        steps={candidate.processing_steps || []}
                    />
                </TabsContent>

                <TabsContent value="finance">
                    <FinanceLedger candidateId={candidate.id} transactions={transactions} />
                </TabsContent>

                <TabsContent value="documents">
                    <DocumentsList candidateId={candidate.id} documents={documents} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
