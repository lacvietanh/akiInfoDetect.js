/**
 * Simple development server with Client Hints headers
 * Use: node server.js
 */

import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

/**
 * IMPORTANT: Client Hints Headers
 * These headers are required for deep hardware detection.
 * Without them, browsers won't send detailed platform information.
 */
const CLIENT_HINTS_HEADERS = {
  'Accept-CH': [
    'Sec-CH-UA',
    'Sec-CH-UA-Mobile',
    'Sec-CH-UA-Platform',
    'Sec-CH-UA-Platform-Version',
    'Sec-CH-UA-Arch',
    'Sec-CH-UA-Bitness',
    'Sec-CH-UA-Model',
    'Sec-CH-UA-Full-Version-List'
  ].join(', '),
  'Critical-CH': 'Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch',
  'Permissions-Policy': 'ch-ua-platform-version=*, ch-ua-arch=*, ch-ua-model=*, ch-ua-bitness=*'
};

const server = createServer((req, res) => {
  // Apply Client Hints headers to all responses
  Object.entries(CLIENT_HINTS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // CORS for local development
  res.setHeader('Access-Control-Allow-Origin', '*');

  let filePath = join(__dirname, req.url === '/' ? 'demo/index.html' : req.url);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Check if file exists
  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  // Serve directory index
  if (statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }

  const ext = extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const content = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (err) {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  🔍 aki-info-detect Development Server                       ║
╠══════════════════════════════════════════════════════════════╣
║  Local:   http://localhost:${PORT}                              ║
║                                                              ║
║  ⚡ Client Hints headers enabled for deep detection          ║
╚══════════════════════════════════════════════════════════════╝
  `);
});
