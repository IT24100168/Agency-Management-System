
const net = require('net');

const client = new net.Socket();
const host = '194.59.164.30';
const port = 3306;

console.log(`Testing connection to ${host}:${port}...`);

client.connect(port, host, function () {
    console.log('Connected successfully! Network path is open.');
    client.destroy();
});

client.on('error', function (err) {
    console.error('Connection failed: ' + err.message);
    if (err.code === 'ETIMEDOUT') {
        console.error('Suggestion: Check Remote MySQL IP whitelist in Hostinger.');
    } else if (err.code === 'ECONNREFUSED') {
        console.error('Suggestion: Database server might be down or not listening on this port.');
    }
    client.destroy();
});

client.setTimeout(5000, function () {
    console.error('Connection timed out after 5 seconds.');
    client.destroy();
});
