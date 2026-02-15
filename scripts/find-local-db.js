const { PrismaClient } = require('@prisma/client');
const net = require('net');

const ports = [3306, 3307, 3308, 3309, 8889];
const hosts = ['127.0.0.1', 'localhost'];
const users = ['root', 'admin'];
const passwords = ['', 'root', 'password', '123456', 'admin'];

async function checkPort(port, host) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(200); // Fast timeout
        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });
        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        socket.on('error', () => {
            resolve(false);
        });
        socket.connect(port, host);
    });
}

async function tryCredential(host, port, user, password) {
    const baseUrl = `mysql://${user}:${password}@${host}:${port}`;
    const url = `${baseUrl}/information_schema`;

    // console.log(`Checking creds: ${baseUrl} ...`); // Too noisy

    const prisma = new PrismaClient({
        datasources: { db: { url } },
        log: [],
    });

    try {
        await prisma.$connect();
        const results = await prisma.$queryRawUnsafe('SHOW DATABASES;');
        await prisma.$disconnect();

        console.log(`\n!!! FOUND SUCCESSFUL CONNECTION !!!`);
        console.log(`URL: ${baseUrl}`);
        console.log('Databases:');
        if (Array.isArray(results)) {
            results.forEach(row => console.log(` - ${row.Database}`));
        }
        return baseUrl;
    } catch (e) {
        await prisma.$disconnect();
        return null;
    }
}

async function main() {
    console.log('Scanning for local MySQL servers...');

    const openPorts = [];

    // Step 1: Scan ports first
    for (const host of hosts) {
        for (const port of ports) {
            process.stdout.write(`Scanning ${host}:${port}... `);
            const isOpen = await checkPort(port, host);
            if (isOpen) {
                console.log('OPEN');
                openPorts.push({ host, port });
            } else {
                console.log('closed');
            }
        }
    }

    if (openPorts.length === 0) {
        console.log('\nNo MySQL ports found open. Is MySQL running?');
        process.exit(1);
    }

    console.log('\nTesting credentials on open ports...');

    // Step 2: Brute force credentials on open ports
    for (const { host, port } of openPorts) {
        for (const user of users) {
            for (const password of passwords) {
                const result = await tryCredential(host, port, user, password);
                if (result) {
                    process.exit(0);
                }
            }
        }
    }

    console.log('\nCould not find working credentials for the open ports.');
    process.exit(1);
}

main();
