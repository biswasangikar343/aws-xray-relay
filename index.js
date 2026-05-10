const http = require('http');
const httpProxy = require('http-proxy');

const TARGET_URL = 'https://hetznew1.connect343.net:51616';

const proxy = httpProxy.createProxyServer({
  target: TARGET_URL,
  changeOrigin: true,
  secure: false,
  ws: true,
  xfwd: true,
  timeout: 0,
  proxyTimeout: 0
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy Error:', err.message);
  if (res && res.writeHead) {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Relay Error - Service Unavailable');
  }
});

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('✅ AWS Xray Relay is Running!\n\nGood Job!');
    return;
  }
  proxy.web(req, res);
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 AWS Relay listening on port ${PORT}`);
});
