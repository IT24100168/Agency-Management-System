
import { Sidebar, MobileSidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-64 h-full">
                <div className="flex items-center p-4 md:hidden border-b bg-white">
                    <MobileSidebar />
                    <span className="font-bold ml-2">Agency Manager</span>
                </div>
                <div className="h-full bg-slate-50">
                    {children}
                </div>
            </main>
        </div>
    )
}
