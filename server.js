// Limit threads to 3 (Safe margin for Prisma + Bcrypt)
process.env.UV_THREADPOOL_SIZE = 3;
// Disable Node.js worker threads where possible (though Next.js might still try)
process.env.NEXT_IS_EXPORT_WORKER = 'true'; // Hack to trick Next.js? No, risky.

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// Try to limit sharp concurrency if present
try {
    const sharp = require('sharp');
    sharp.concurrency(1);
    sharp.cache(false);
} catch (e) {
    // Sharp not installed or failed to configure, ignore
}

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            // Be sure to pass `true` as the second argument to `url.parse`.
            // This tells it to parse the query portion of the URL.
            const parsedUrl = parse(req.url, true)

            await handle(req, res, parsedUrl)
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    })
        .listen(port, (err) => {
            if (err) throw err
            console.log(`> Ready on http://${hostname}:${port}`)
        })
})
