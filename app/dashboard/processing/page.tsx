
import { Suspense } from 'react'
import { getProcessingCandidates } from './actions'
import { ProcessingBoard } from './board'

export const dynamic = 'force-dynamic'

export default async function ProcessingPage() {
    const candidates = await getProcessingCandidates()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6 h-full flex flex-col">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Processing Pipeline</h2>
            </div>
            <div className="flex-1 overflow-hidden">
                <Suspense fallback={<div>Loading board...</div>}>
                    <ProcessingBoard candidates={candidates} />
                </Suspense>
            </div>
        </div>
    )
}
