
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const candidate = await prisma.candidate.findFirst()
    if (candidate) {
        console.log(`CANDIDATE_ID:${candidate.id}`)
    } else {
        console.log('NO_CANDIDATES')
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
