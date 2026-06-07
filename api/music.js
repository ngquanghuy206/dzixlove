// Vercel API Route — proxy sang server.py (SoundCloud + YouTube)
// SoundCloud: /api/music?_p=/search&q=bai+hat
// YouTube:    /api/music?_p=/yt/search&q=phim&pageToken=xxx
//             /api/music?_p=/yt/trending
//             /api/music?_p=/yt/detail&videoId=xxx

const TARGET = 'http://prem-eu5.bot-hosting.cloud:20427';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    const url = new URL(req.url, 'http://localhost');
    const path = url.searchParams.get('_p') || '/';
    url.searchParams.delete('_p');
    const qs = url.searchParams.toString();

    const target = TARGET + path + (qs ? '?' + qs : '');

    const response = await fetch(target, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15000),
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (e) {
    res.status(502).json({ ok: false, error: e.message });
  }
}
