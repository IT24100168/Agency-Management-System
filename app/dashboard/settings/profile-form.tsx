
'use client'

import { useActionState } from 'react' // or useFormState pending Next.js version
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from './actions'
import { useFormStatus } from 'react-dom'

const initialState = {
    error: '',
    success: ''
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Change Password"}
        </Button>
    )
}

export function ProfileForm({ user }: { user: any }) {
    const [state, formAction] = useActionState(updatePassword, initialState)

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input disabled defaultValue={user?.name || ''} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input disabled defaultValue={user?.email || ''} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Role</Label>
                        <Input disabled defaultValue={user?.role || ''} className="capitalize" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current">Current Password</Label>
                            <Input id="current" name="currentPassword" type="password" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new">New Password</Label>
                            <Input id="new" name="newPassword" type="password" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm">Confirm Password</Label>
                            <Input id="confirm" name="confirmPassword" type="password" required />
                        </div>

                        {state?.error && (
                            <p className="text-sm text-red-500">{state.error}</p>
                        )}
                        {state?.success && (
                            <p className="text-sm text-green-500">{state.success}</p>
                        )}

                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
