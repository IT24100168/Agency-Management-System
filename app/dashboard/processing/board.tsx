
'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { PROCESSING_STEPS } from '@/lib/constants'

type Candidate = {
    id: string
    name: string
    passport: string
    status: string
    photo: string | null
    agent?: string
}

export function ProcessingBoard({ candidates }: { candidates: Candidate[] }) {

    const grouped = useMemo(() => {
        const groups: Record<string, Candidate[]> = {}
        // Initialize groups
        for (const step of PROCESSING_STEPS) {
            groups[step] = []
        }

        candidates.forEach(c => {
            // If status is not in columns (e.g. from old data), maybe put in first or last, or ignore.
            // For now, if exact match, place it.
            if (groups[c.status]) {
                groups[c.status].push(c)
            } else {
                // Fallback for unknown status
                if (!groups['Uncategorized']) groups['Uncategorized'] = []
                groups['Uncategorized'].push(c)
            }
        })
        return groups
    }, [candidates])

    const displayColumns = [...PROCESSING_STEPS] as string[]

    return (
        <ScrollArea className="h-full w-full whitespace-nowrap rounded-md border bg-slate-100/50 p-4">
            <div className="flex pb-4 gap-4">
                {displayColumns.map(col => (
                    <div key={col} className="w-[320px] flex-none flex flex-col gap-4">
                        <div className="flex items-center justify-between p-2 font-semibold text-slate-700 bg-white/50 rounded-lg backdrop-blur-sm border">
                            <span>{col}</span>
                            <Badge variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-slate-300">
                                {grouped[col]?.length || 0}
                            </Badge>
                        </div>

                        <div className="flex flex-col gap-3 min-h-[500px]">
                            {grouped[col]?.map(candidate => (
                                <ProcessingCard key={candidate.id} candidate={candidate} />
                            ))}
                            {grouped[col]?.length === 0 && (
                                <div className="h-24 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                                    No candidates
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}

function ProcessingCard({ candidate }: { candidate: Candidate }) {
    const initials = candidate.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

    return (
        <Card className="w-full hover:shadow-md transition-all cursor-pointer group bg-white">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={candidate.photo || undefined} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="font-semibold text-sm leading-none truncate max-w-[140px]" title={candidate.name}>
                                {candidate.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                                {candidate.passport}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" asChild>
                        <Link href={`/dashboard/candidates/${candidate.id}`}>
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Link>
                    </Button>
                </div>

                {candidate.agent && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-slate-50 p-1.5 rounded">
                        <span className="font-medium">Agent:</span> {candidate.agent}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
