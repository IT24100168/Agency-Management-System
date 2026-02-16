
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function TestDBPage() {
    let message = 'Checking connection...';
    let userCount = -1;
    let error = null;

    try {
        await prisma.$connect();
        userCount = await prisma.user.count();
        message = 'Success! Connected to database.';
    } catch (e: any) {
        message = 'Failed to connect.';
        error = e.message;
        console.error(e);
    }

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h1>Database Connection Test</h1>
            <p><strong>Status:</strong> {message}</p>
            {userCount >= 0 && <p><strong>User Count:</strong> {userCount}</p>}

            <div style={{ marginTop: '20px', background: '#f5f5f5', padding: '15px' }}>
                <h3>Environment Diagnostics</h3>
                <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
                <p><strong>Available Env Keys:</strong></p>
                <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
                    {JSON.stringify(Object.keys(process.env).sort(), null, 2)}
                </pre>
            </div>

            {error && (
                <div style={{ background: '#fee', color: '#c00', padding: '10px', marginTop: '20px', whiteSpace: 'pre-wrap' }}>
                    <strong>Error Details:</strong><br />
                    {error}
                </div>
            )}
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                Timestamp: {new Date().toISOString()}
            </div>
        </div>
    );
}
