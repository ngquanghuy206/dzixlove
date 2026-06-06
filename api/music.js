// Vercel API Route — proxy sang server.py để tránh Mixed Content
// Web gọi: /api/music?_p=/search&q=buon+cua+anh
// Route này forward sang: http://bot-hosting:20427/search?q=buon+cua+anh

const TARGET = 'http://prem-eu5.bot-hosting.cloud:20427';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    // Lấy path từ _p param, phần còn lại là query string
    const url = new URL(req.url, 'http://localhost');
    const path = url.searchParams.get('_p') || '/';
    url.searchParams.delete('_p');
    const qs = url.searchParams.toString();

    const target = TARGET + path + (qs ? '?' + qs : '');

    const response = await fetch(target, {
      headers: { 'Accept': 'application/json' },
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (e) {
    res.status(502).json({ ok: false, error: e.message });
  }
}
