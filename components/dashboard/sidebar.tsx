
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'

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

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
    const pathname = usePathname()

    return (
        <div className={cn("space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white", mobile ? "w-full" : "w-64")}>
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        {/* Logo placeholder - using text for now */}
                        <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center">
                            <span className="font-bold text-slate-900">A</span>
                        </div>
                    </div>
                    <h1 className="text-xl font-bold">AMS Portal</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
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
            <div className="px-3">
                <div className="bg-slate-800 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-x-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/avatar-placeholder.png" />
                            <AvatarFallback className="bg-sky-500 text-white">AD</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">Admin User</span>
                            <span className="text-xs text-zinc-400">admin@agency.com</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false)
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-slate-900 border-none text-white w-72">
                <Sidebar mobile />
            </SheetContent>
        </Sheet>
    )
}
