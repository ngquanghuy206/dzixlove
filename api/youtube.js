// Vercel API Route — YouTube Data API v3 proxy
// Web gọi: /api/youtube?q=phim+hay&page=1&type=search
//          /api/youtube?type=trending
//          /api/youtube?videoId=xxx&type=detail

const YT_KEY = process.env.YOUTUBE_API_KEY || '';
const BASE   = 'https://www.googleapis.com/youtube/v3';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (!YT_KEY) {
    res.status(500).json({ ok: false, error: 'YOUTUBE_API_KEY chưa được cấu hình trong Vercel env' });
    return;
  }

  const { q = '', page = '1', type = 'search', videoId = '', pageToken = '' } = req.query;

  try {
    // ── 1. SEARCH ──────────────────────────────
    if (type === 'search') {
      if (!q.trim()) { res.json({ items: [], nextPageToken: null }); return; }

      const params = new URLSearchParams({
        part: 'snippet',
        q: q,
        type: 'video',
        maxResults: '20',
        regionCode: 'VN',
        relevanceLanguage: 'vi',
        videoDuration: 'medium',       // lọc bỏ short clips < 4 phút
        key: YT_KEY,
      });
      if (pageToken) params.set('pageToken', pageToken);

      const r = await fetch(`${BASE}/search?${params}`);
      const d = await r.json();
      if (!r.ok) { res.status(r.status).json({ ok: false, error: d.error?.message || 'YT error' }); return; }

      // Lấy thêm duration từ videos.list
      const ids = (d.items || []).map(i => i.id?.videoId).filter(Boolean).join(',');
      let durMap = {};
      if (ids) {
        const vr = await fetch(`${BASE}/videos?part=contentDetails,statistics&id=${ids}&key=${YT_KEY}`);
        const vd = await vr.json();
        (vd.items || []).forEach(v => {
          durMap[v.id] = { dur: parseDuration(v.contentDetails?.duration), views: v.statistics?.viewCount };
        });
      }

      const items = (d.items || []).map(item => {
        const vid = item.id?.videoId || '';
        const sn  = item.snippet || {};
        const extra = durMap[vid] || {};
        return {
          videoId:    vid,
          title:      sn.title || '',
          author:     sn.channelTitle || '',
          published:  sn.publishedAt || '',
          description: sn.description || '',
          lengthSeconds: extra.dur || 0,
          viewCount:  extra.views || '0',
          videoThumbnails: [
            { quality: 'medium', url: sn.thumbnails?.medium?.url || sn.thumbnails?.default?.url || '' },
            { quality: 'high',   url: sn.thumbnails?.high?.url   || '' },
          ],
        };
      });

      res.json({ items, nextPageToken: d.nextPageToken || null, totalResults: d.pageInfo?.totalResults || 0 });
      return;
    }

    // ── 2. TRENDING (trang chủ DZITube) ────────
    if (type === 'trending') {
      const params = new URLSearchParams({
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode: 'VN',
        videoCategoryId: '1',   // Film & Animation
        maxResults: '20',
        key: YT_KEY,
      });

      const r = await fetch(`${BASE}/videos?${params}`);
      const d = await r.json();
      if (!r.ok) { res.status(r.status).json({ ok: false, error: d.error?.message }); return; }

      const items = (d.items || []).map(v => ({
        videoId:    v.id,
        title:      v.snippet?.title || '',
        author:     v.snippet?.channelTitle || '',
        published:  v.snippet?.publishedAt || '',
        lengthSeconds: parseDuration(v.contentDetails?.duration),
        viewCount:  v.statistics?.viewCount || '0',
        videoThumbnails: [
          { quality: 'medium', url: v.snippet?.thumbnails?.medium?.url || '' },
          { quality: 'high',   url: v.snippet?.thumbnails?.high?.url   || '' },
        ],
      }));

      res.json({ items, nextPageToken: d.nextPageToken || null });
      return;
    }

    // ── 3. VIDEO DETAIL ─────────────────────────
    if (type === 'detail' && videoId) {
      const params = new URLSearchParams({
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: YT_KEY,
      });
      const r = await fetch(`${BASE}/videos?${params}`);
      const d = await r.json();
      const v = (d.items || [])[0];
      if (!v) { res.status(404).json({ ok: false, error: 'Video not found' }); return; }

      res.json({
        videoId:    v.id,
        title:      v.snippet?.title || '',
        author:     v.snippet?.channelTitle || '',
        description: v.snippet?.description || '',
        lengthSeconds: parseDuration(v.contentDetails?.duration),
        viewCount:  v.statistics?.viewCount || '0',
        likeCount:  v.statistics?.likeCount || '0',
        videoThumbnails: [
          { quality: 'medium', url: v.snippet?.thumbnails?.medium?.url || '' },
          { quality: 'high',   url: v.snippet?.thumbnails?.maxres?.url || v.snippet?.thumbnails?.high?.url || '' },
        ],
      });
      return;
    }

    res.status(400).json({ ok: false, error: 'type không hợp lệ. Dùng: search | trending | detail' });

  } catch (e) {
    res.status(502).json({ ok: false, error: e.message });
  }
}

// ISO 8601 duration PT1H2M3S → seconds
function parseDuration(s) {
  if (!s) return 0;
  const m = s.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1]||0)*3600) + (parseInt(m[2]||0)*60) + parseInt(m[3]||0);
}
