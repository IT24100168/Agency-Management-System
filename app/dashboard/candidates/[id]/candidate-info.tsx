
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Candidate } from "@/types/candidate"

export function CandidateInfo({ candidate }: { candidate: Candidate }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <span className="font-semibold text-muted-foreground block">Full Name</span>
                        <span>{candidate.full_name}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-muted-foreground block">Date of Birth</span>
                        <span>{new Date(candidate.dob).toLocaleDateString()}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-muted-foreground block">Gender</span>
                        <span>{candidate.gender}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-muted-foreground block">Contact</span>
                        <span>{candidate.contact_number}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Passport Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <span className="font-semibold text-muted-foreground block">Passport Number</span>
                        <span className="font-mono text-lg">{candidate.passport_no}</span>
                    </div>
                    {/* Add Expiry, Issue Date if schema supports it later */}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Agent Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <span className="font-semibold text-muted-foreground block">Referred By</span>
                        <span>{candidate.agent_id ? "Agent ID: " + candidate.agent_id : "Direct Walk-in"}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-muted-foreground block">Registration Date</span>
                        <span>{new Date(candidate.created_at).toLocaleDateString()}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
