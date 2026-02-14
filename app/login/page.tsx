
import { login, signup } from './actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function LoginPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams
    const error = searchParams.error as string
    const message = searchParams.message as string

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-blue-600">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">
                        Agency Management System
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the secure portal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="admin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="admin">Admin</TabsTrigger>
                            <TabsTrigger value="staff">Staff</TabsTrigger>
                        </TabsList>

                        <TabsContent value="admin">
                            <form className="space-y-4">
                                <input type="hidden" name="role_hint" value="admin" />
                                {error && (
                                    <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-md text-sm text-center font-medium">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email-admin">Email</Label>
                                    <Input id="email-admin" name="email" type="email" placeholder="admin@agency.com" required className="block w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-admin">Password</Label>
                                    <Input id="password-admin" name="password" type="password" required />
                                </div>
                                <Button formAction={login} className="w-full bg-blue-600 hover:bg-blue-700">Sign In as Admin</Button>
                                {/* Dev only button inside form for layout simplicity or separate? Keeping it simple. */}
                            </form>
                        </TabsContent>

                        <TabsContent value="staff">
                            <form className="space-y-4">
                                <input type="hidden" name="role_hint" value="staff" />
                                {error && (
                                    <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-md text-sm text-center font-medium">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email-staff">Email</Label>
                                    <Input id="email-staff" name="email" type="email" placeholder="staff@agency.com" required className="block w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-staff">Password</Label>
                                    <Input id="password-staff" name="password" type="password" required />
                                </div>
                                <Button formAction={login} className="w-full bg-slate-600 hover:bg-slate-700">Sign In as Staff</Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-4">
                        <form>
                            <Button formAction={signup} variant="outline" className="w-full text-xs h-8">
                                Create Account (Dev Only)
                            </Button>
                        </form>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-sm text-gray-500">
                    <p>Protected by high-grade encryption.</p>
                </CardFooter>
            </Card>
        </div>
    )
}
