
import { verifySession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { getUsers } from './actions'
import { ProfileForm } from './profile-form'
import { UsersList } from './users-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const session = await verifySession()
    if (!session?.isAuth) redirect('/login')

    const user = { role: session.role } // Minimal user object for check
    const isAdmin = session.role === 'admin'
    const users = isAdmin ? await getUsers() : []

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    {isAdmin && <TabsTrigger value="users">Team Members</TabsTrigger>}
                </TabsList>
                <TabsContent value="profile" className="space-y-4">
                    <ProfileForm user={session} />
                </TabsContent>
                {isAdmin && (
                    <TabsContent value="users" className="space-y-4">
                        <UsersList users={users} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
