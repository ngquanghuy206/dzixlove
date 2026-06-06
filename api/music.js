// Vercel API Route — proxy sang server.py để tránh Mixed Content
const TARGET = 'http://prem-eu5.bot-hosting.cloud:20427';

export default async function handler(req, res) {
  // Cho phép CORS từ web
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    // Ghép lại URL gốc: /api/music/search?q=... → /search?q=...
    const path = req.url.replace(/^\/api\/music/, '') || '/';
    const url  = TARGET + path;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (e) {
    res.status(502).json({ ok: false, error: e.message });
  }
}
