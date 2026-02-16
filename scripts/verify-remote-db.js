const { PrismaClient } = require('@prisma/client');

// The exact URL the user provided
const connectionString = "mysql://u251120027_agency_admin:Hh@5454-@153.92.15.39:3306/u251120027_agency_system";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: connectionString,
        },
    },
});

async function main() {
    console.log('Testing connection to Hostinger Database...');
    console.log(`URL: ${connectionString.replace(/:[^:@]*@/, ':****@')}`);

    try {
        await prisma.$connect();
        console.log('\nSUCCESS! Connection established.');

        const userCount = await prisma.user.count();
        console.log(`Database is accessible. User count: ${userCount}`);

    } catch (e) {
        console.error('\nCONNECTION FAILED:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
