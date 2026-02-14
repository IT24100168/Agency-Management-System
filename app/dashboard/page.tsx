import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CheckCircle, Wallet } from "lucide-react"
import { getDashboardStats, getRecentActivity } from "./actions"
import { getReminders } from "./reminders/actions"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { AddReminderDialog } from "@/components/dashboard/reminders/add-reminder-dialog"
import { ReminderList } from "@/components/dashboard/reminders/reminder-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
    const stats = await getDashboardStats()
    const recentActivity = await getRecentActivity()
    const reminders = await getReminders()

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Candidates
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCandidates}</div>
                        <p className="text-xs text-muted-foreground">
                            Registered candidates
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Agents
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAgents}</div>
                        <p className="text-xs text-muted-foreground">
                            Active agents
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Monthly Income
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. {stats.monthlyIncome.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Monthly Expenses
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. {stats.monthlyExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Recruitment by Country</h3>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                    {Object.entries(stats.countryStats).map(([country, count]) => {
                        const flags: Record<string, string> = {
                            'Romania': '🇷🇴',
                            'Qatar': '🇶🇦',
                            'Kuwait': '🇰🇼',
                            'Dubai': '🇦🇪', // UAE flag for Dubai
                            'Oman': '🇴🇲',
                            'Jordan': '🇯🇴',
                            'Saudi Arabia': '🇸🇦'
                        }
                        return (
                            <Card key={country}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                                    <CardTitle className="text-xs font-medium text-muted-foreground">
                                        {country}
                                    </CardTitle>
                                    <span className="text-lg">{flags[country] || '🏳️'}</span>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="text-2xl font-bold">{count as number}</div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Income Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart data={stats.incomeHistory} />
                    </CardContent>
                </Card>
                <div className="col-span-3 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Link href="/dashboard/candidates?new=true" className="w-full">
                                <Button variant="outline" className="w-full justify-start">
                                    <Users className="mr-2 h-4 w-4" />
                                    Register New Candidate
                                </Button>
                            </Link>
                            <Link href="/dashboard/processing" className="w-full">
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Check Processing Status
                                </Button>
                            </Link>
                            <Link href="/dashboard/agents" className="w-full">
                                <Button variant="outline" className="w-full justify-start">
                                    <Users className="mr-2 h-4 w-4" />
                                    Manage Agents
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Reminders</CardTitle>
                            <AddReminderDialog />
                        </CardHeader>
                        <CardContent>
                            <ReminderList reminders={reminders} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {recentActivity.map((candidate: any) => (
                                    <div key={candidate.id} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{candidate.full_name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Status: {candidate.status}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            {new Date(candidate.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                                {recentActivity.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">No recent activity.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    )
}
