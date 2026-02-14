
'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintTrigger() {
    useEffect(() => {
        // Optional: Auto-print when page loads
        // window.print()
    }, [])

    return (
        <div className="fixed top-4 right-4 print:hidden">
            <Button onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Print Report
            </Button>
        </div>
    )
}
