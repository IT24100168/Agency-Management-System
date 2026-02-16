
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
