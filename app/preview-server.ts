import WebSocket, { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('starting preview server');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`dirname: ${__dirname} , filename: ${__filename}`);


const PORT = 3001;
const postsDir = path.join(__dirname, '../posts');

const wss = new WebSocketServer({ port: PORT });
wss.on('connection', ws => {
  console.log('Client connected');
});

function broadcast(data: string) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

let debounceTimeout: NodeJS.Timeout | null = null;
chokidar.watch(postsDir, {
  persistent: true,
  ignoreInitial: true,
  depth: 0,
}).on('change', filePath => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        console.error(err);
        return;
      }
      const payload = JSON.stringify({
        file: path.basename(filePath),
        content: content,
      });
      broadcast(payload);
      console.log(`updated content for ${filePath}`);
    });
  }, 50);
});

console.log(`preview server running on ws://localhost:${PORT}`);
