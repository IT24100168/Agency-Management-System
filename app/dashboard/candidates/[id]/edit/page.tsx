
import { getCandidate } from "../actions"
import EditCandidateForm from "./edit-form"
import { notFound } from "next/navigation"

export default async function EditCandidatePage({ params }: { params: { id: string } }) {
    const candidate = await getCandidate(params.id)

    if (!candidate) {
        notFound()
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Edit Candidate</h2>
            <EditCandidateForm candidate={candidate} />
        </div>
    )
}
