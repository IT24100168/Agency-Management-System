

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    Users,
    LayoutDashboard,
    Briefcase,
    FileText,
    DollarSign,
    Settings,
    LogOut,
    UserCircle,
    Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'
import { handleSignOut } from '@/app/dashboard/signout-action'

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: 'text-sky-500',
    },
    {
        label: 'Candidates',
        icon: Users,
        href: '/dashboard/candidates',
        color: 'text-violet-500',
    },
    {
        label: 'Processing',
        icon: FileText,
        href: '/dashboard/processing',
        color: 'text-pink-700',
    },
    {
        label: 'Accounting',
        icon: DollarSign,
        href: '/dashboard/accounting',
        color: 'text-orange-700',
    },
    {
        label: 'Agents',
        icon: Briefcase,
        href: '/dashboard/agents',
        color: 'text-emerald-500',
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
    },
]

interface SidebarProps {
    mobile?: boolean
    user?: any
}

export function Sidebar({ mobile = false, user }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn("space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white", mobile ? "w-full" : "w-64")}>
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex flex-col items-center mb-10 mt-4">
                    <div className="relative w-24 h-24 mb-3">
                        <img src="/logo.png" alt="Logo" className="rounded-lg w-full h-full object-contain bg-white p-1" />
                    </div>
                    <h1 className="text-xl font-bold text-center text-white">Rightway Agencies</h1>
                </Link>
                <div className="space-y-1">
                    {routes.filter(route => {
                        if (route.label === 'Accounting' && user?.role !== 'admin') return false
                        if (route.label === 'Settings' && user?.role !== 'admin') return true
                        return true
                    }).map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                                pathname === route.href ? 'text-white bg-white/10' : 'text-zinc-400'
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-3 mt-auto">
                <div className="bg-slate-800 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-x-2 mb-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.image || "/avatar-placeholder.png"} />
                            <AvatarFallback className="bg-sky-500 text-white">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold truncate">{user?.name || 'User'}</span>
                            <span className="text-xs text-zinc-400 truncate">{user?.email}</span>
                        </div>
                    </div>
                    <form action={handleSignOut}>
                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 px-2 text-xs">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export function MobileSidebar({ user }: { user?: any }) {
    const [open, setOpen] = useState(false)
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-slate-900 border-none text-white w-72">
                <Sidebar mobile user={user} />
            </SheetContent>
        </Sheet>
    )
}

