
import { RegisterForm } from "./register-form"
import { getAgents } from "../../agents/actions"

export default async function RegisterCandidatePage() {
    const agents = await getAgents()

    return <RegisterForm agents={agents} />
}
