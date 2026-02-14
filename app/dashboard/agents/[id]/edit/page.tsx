
import { getAgent } from "../../actions"
import EditAgentForm from "./edit-form"
import { notFound } from "next/navigation"

type Params = Promise<{ id: string }>

export default async function EditAgentPage(props: { params: Params }) {
    const params = await props.params;
    const agent = await getAgent(params.id)

    if (!agent) {
        notFound()
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-center">Update Agent</h2>
            <EditAgentForm agent={agent} />
        </div>
    )
}
