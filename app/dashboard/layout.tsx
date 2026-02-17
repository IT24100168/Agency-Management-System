
import { Sidebar, MobileSidebar } from '@/components/dashboard/sidebar'
import { verifySession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await verifySession()
    if (!session?.isAuth || !session.userId) redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            // Add image if it exists in schema, otherwise sidebar handles null
        }
    })

    if (!user) redirect('/login')

    // Map to expected sidebar user format
    const sidebarUser = {
        name: user.fullName,
        email: user.email,
        role: user.role,
        image: null // Add image field if schema supports it
    }

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
                <Sidebar user={sidebarUser} />
            </div>
            <main className="md:pl-64 h-full">
                <div className="flex items-center p-4 md:hidden border-b bg-white">
                    <MobileSidebar user={sidebarUser} />
                    <span className="font-bold ml-2">Rightway Foreign Employment Agencies</span>
                </div>
                <div className="h-full bg-slate-50">
                    {children}
                </div>
            </main>
        </div>
    )
}
