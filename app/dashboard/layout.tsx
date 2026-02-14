
import { Sidebar, MobileSidebar } from '@/components/dashboard/sidebar'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    if (!session?.user) redirect('/login')

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
                <Sidebar user={session.user} />
            </div>
            <main className="md:pl-64 h-full">
                <div className="flex items-center p-4 md:hidden border-b bg-white">
                    <MobileSidebar user={session.user} />
                    <span className="font-bold ml-2">Rightway Foreign Employment Agencies</span>
                </div>
                <div className="h-full bg-slate-50">
                    {children}
                </div>
            </main>
        </div>
    )
}
