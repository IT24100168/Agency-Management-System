
import { login, signup } from './actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'


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
                    <form className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-md text-sm text-center font-medium">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="p-3 bg-green-100 border border-green-200 text-green-600 rounded-md text-sm text-center font-medium">
                                {message}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@agency.com"
                                required
                                className="block w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Button formAction={login} className="w-full bg-blue-600 hover:bg-blue-700">
                                Sign In
                            </Button>
                            <Button formAction={signup} variant="outline" className="w-full">
                                Create Account (Dev Only)
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-sm text-gray-500">
                    <p>Protected by high-grade encryption.</p>
                </CardFooter>
            </Card>
        </div>
    )
}
