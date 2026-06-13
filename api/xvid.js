// Vercel API Route — proxy sang xvidapi.com để tránh CORS
// Frontend gọi: /api/xvid?ac=detail&t=43&pg=1&pagesize=20
// Route này forward thẳng sang xvidapi.com/api.php/provide/vod

const XVID_BASE = 'https://xvidapi.com/api.php/provide/vod';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=600');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    // Copy tất cả query params từ request, đảm bảo at=json
    const params = new URLSearchParams();
    const allowed = ['ac','t','ids','wd','pg','pagesize','h','sort_direction','actor','category','code','year','isend'];
    for (const key of allowed) {
      if (req.query[key] !== undefined) params.set(key, req.query[key]);
    }
    // Luôn trả JSON
    params.set('at', 'json');
    if (!params.has('ac')) params.set('ac', 'detail');

    const url = `${XVID_BASE}?${params.toString()}`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(15000),
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (e) {
    res.status(502).json({ ok: false, error: e.message });
  }
}
