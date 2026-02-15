const { PrismaClient } = require('@prisma/client');

// The credentials found in .env.local
const oldDbUrl = process.env.OLD_DB_URL || "mysql://u251120027_AMC:Hh%405454-@194.59.164.30:3306/u251120027_AMC";

async function main() {
    console.log(`Testing connection to OLD database: ${oldDbUrl.replace(/:[^:@]*@/, ':****@')} ...`);

    const prisma = new PrismaClient({
        datasources: { db: { url: oldDbUrl } },
    });

    try {
        await prisma.$connect();

        // Count users to verify data exists
        const userCount = await prisma.user.count();
        const candidateCount = await prisma.candidate.count();

        console.log(`\nSUCCESS! Connected to OLD database.`);
        console.log(`Found ${userCount} users and ${candidateCount} candidates.`);

        return true;
    } catch (e) {
        console.error(`\nConnection failed: ${e.message}`);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

main();
