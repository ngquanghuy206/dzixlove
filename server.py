#!/usr/bin/env python3
"""
DZI MUSIC SERVER — SoundCloud Search Tool
Public: http://prem-eu5.bot-hosting.cloud:20427
pip install fastapi uvicorn requests beautifulsoup4
"""

import os, re, time, urllib.parse, isodate, hashlib, json, secrets
from pymongo import MongoClient
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
import uvicorn

HCAPTCHA_SECRET = os.environ.get("HCAPTCHA_SECRET", "ES_5ae92e39bc0a4d4cba6cbd7eca0e4d88")

def _verify_hcaptcha(token: str) -> bool:
    if not token: return False
    try:
        r = requests.post("https://api.hcaptcha.com/siteverify", data={"secret": HCAPTCHA_SECRET, "response": token}, timeout=5)
        return r.json().get("success", False)
    except:
        return False

# ── YouTube Data API v3 ────────────────────────────────────
YT_KEY    = os.environ.get("YOUTUBE_API_KEY", "AIzaSyBLnMuEHZA4vwPzEn_WjP1Cu31qRQWAbbU")
YT_BASE   = "https://www.googleapis.com/youtube/v3"
YT_SESS   = requests.Session()

def yt_parse_duration(s):
    """PT1H2M3S → seconds"""
    if not s: return 0
    try: return int(isodate.parse_duration(s).total_seconds())
    except:
        m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', s or '')
        if not m: return 0
        return int(m.group(1) or 0)*3600 + int(m.group(2) or 0)*60 + int(m.group(3) or 0)

def yt_search(q: str, page_token: str = ""):
    params = {
        "part": "snippet", "q": q, "type": "video",
        "maxResults": 20, "regionCode": "VN",
        "relevanceLanguage": "vi", "key": YT_KEY,
    }
    if page_token: params["pageToken"] = page_token
    r = YT_SESS.get(f"{YT_BASE}/search", params=params, timeout=10)
    if r.status_code == 403:
        err = r.json().get("error", {})
        raise Exception(f"YouTube API lỗi: {err.get('message', 'quota exceeded hoặc API key không hợp lệ')}")
    r.raise_for_status()
    d = r.json()
    ids = ",".join(i["id"]["videoId"] for i in d.get("items", []) if i.get("id", {}).get("videoId"))
    dur_map = {}
    if ids:
        vr = YT_SESS.get(f"{YT_BASE}/videos", params={"part": "contentDetails,statistics", "id": ids, "key": YT_KEY}, timeout=10)
        for v in vr.json().get("items", []):
            dur_map[v["id"]] = {
                "dur": yt_parse_duration(v.get("contentDetails", {}).get("duration", "")),
                "views": v.get("statistics", {}).get("viewCount", "0"),
            }
    items = []
    for item in d.get("items", []):
        vid = item.get("id", {}).get("videoId", "")
        if not vid: continue
        sn  = item.get("snippet", {})
        ex  = dur_map.get(vid, {})
        thumbs = sn.get("thumbnails", {})
        items.append({
            "videoId": vid,
            "title": sn.get("title", ""),
            "author": sn.get("channelTitle", ""),
            "published": sn.get("publishedAt", ""),
            "lengthSeconds": ex.get("dur", 0),
            "viewCount": ex.get("views", "0"),
            "videoThumbnails": [
                {"quality": "medium", "url": thumbs.get("medium", {}).get("url", "")},
                {"quality": "high",   "url": thumbs.get("high",   {}).get("url", "")},
            ],
        })
    return {"items": items, "nextPageToken": d.get("nextPageToken"), "totalResults": d.get("pageInfo", {}).get("totalResults", 0)}

def yt_trending():
    params = {
        "part": "snippet,contentDetails,statistics",
        "chart": "mostPopular", "regionCode": "VN",
        "videoCategoryId": "1", "maxResults": 20, "key": YT_KEY,
    }
    r = YT_SESS.get(f"{YT_BASE}/videos", params=params, timeout=10)
    r.raise_for_status()
    d2 = r.json()
    items = []
    for v in d2.get("items", []):
        sn = v.get("snippet", {}); thumbs = sn.get("thumbnails", {})
        items.append({
            "videoId": v["id"],
            "title": sn.get("title", ""),
            "author": sn.get("channelTitle", ""),
            "published": sn.get("publishedAt", ""),
            "lengthSeconds": yt_parse_duration(v.get("contentDetails", {}).get("duration", "")),
            "viewCount": v.get("statistics", {}).get("viewCount", "0"),
            "videoThumbnails": [
                {"quality": "medium", "url": thumbs.get("medium", {}).get("url", "")},
                {"quality": "high",   "url": thumbs.get("high",   {}).get("url", "")},
            ],
        })
    return {"items": items, "nextPageToken": d2.get("nextPageToken")}

def yt_shorts(q: str = "", page_token: str = ""):
    keyword = (q.strip() + " #shorts") if q.strip() else "#shorts"
    params = {
        "part": "snippet", "q": keyword, "type": "video",
        "maxResults": 20, "regionCode": "VN",
        "videoDuration": "short",  # < 4 phút
        "key": YT_KEY,
    }
    if page_token: params["pageToken"] = page_token
    r = YT_SESS.get(f"{YT_BASE}/search", params=params, timeout=10)
    if r.status_code == 403:
        err = r.json().get("error", {})
        raise Exception(f"YouTube API lỗi: {err.get('message', 'quota exceeded hoặc API key không hợp lệ')}")
    r.raise_for_status()
    d = r.json()
    items = []
    for item in d.get("items", []):
        vid = item.get("id", {}).get("videoId", "")
        if not vid: continue
        sn = item.get("snippet", {}); thumbs = sn.get("thumbnails", {})
        items.append({
            "videoId": vid,
            "title": sn.get("title", ""),
            "author": sn.get("channelTitle", ""),
            "videoThumbnails": [
                {"quality": "medium", "url": thumbs.get("medium", {}).get("url", "") or thumbs.get("default", {}).get("url", "")},
                {"quality": "high",   "url": thumbs.get("high", {}).get("url", "")},
            ],
        })
    return {"items": items, "nextPageToken": d.get("nextPageToken")}

def yt_detail(video_id: str):
    params = {"part": "snippet,contentDetails,statistics", "id": video_id, "key": YT_KEY}
    r = YT_SESS.get(f"{YT_BASE}/videos", params=params, timeout=10)
    r.raise_for_status()
    items = r.json().get("items", [])
    if not items: raise HTTPException(404, "Video not found")
    v = items[0]; sn = v.get("snippet", {}); thumbs = sn.get("thumbnails", {})
    return {
        "videoId": v["id"],
        "title": sn.get("title", ""),
        "author": sn.get("channelTitle", ""),
        "description": sn.get("description", ""),
        "lengthSeconds": yt_parse_duration(v.get("contentDetails", {}).get("duration", "")),
        "viewCount": v.get("statistics", {}).get("viewCount", "0"),
        "likeCount": v.get("statistics", {}).get("likeCount", "0"),
        "videoThumbnails": [
            {"quality": "medium", "url": thumbs.get("medium", {}).get("url", "")},
            {"quality": "high",   "url": (thumbs.get("maxres") or thumbs.get("high", {})).get("url", "")},
        ],
    }

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ── Auth System ─────────────────────────────────────────────

def _hash(pw): return hashlib.sha256(pw.encode()).hexdigest()

ADMIN_ACCOUNTS = {
    "knammelbel206": _hash("nqh300506")
}

# ── MongoDB ──────────────────────────────────────────────
MONGO_URI = os.environ.get("MONGODB_URI", "mongodb+srv://viabydzi1_db_user:F6hpx0Di75dACYcL@dzimeomeo.tvo9w5z.mongodb.net/?appName=dzimeomeo")
_mc = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
_db = _mc["dzi_music"]
_col_users    = _db["users"]
_col_stats    = _db["stats"]
_col_sessions = _db["sessions"]

def _load_users():
    users = {}
    for doc in _col_users.find({}, {"_id": 0}):
        u = doc.pop("username")
        users[u] = doc
    return users

def _save_users(u):
    for username, data in u.items():
        _col_users.update_one({"username": username}, {"$set": {"username": username, **data}}, upsert=True)

def _get_stat(key, default=1247):
    doc = _col_stats.find_one({"key": key})
    return doc["value"] if doc else default

def _set_stat(key, value):
    _col_stats.update_one({"key": key}, {"$set": {"key": key, "value": value}}, upsert=True)

def _get_user(req: Request):
    tok = (req.headers.get("Authorization","")).replace("Bearer ","").strip()
    if not tok: return None
    doc = _col_sessions.find_one({"token": tok})
    return doc["username"] if doc else None

SESSION_TTL_DAYS = 7

def _create_session(username):
    tok = secrets.token_hex(32)
    _col_sessions.insert_one({"token": tok, "username": username, "created": time.time()})
    # Xóa sessions cũ hơn SESSION_TTL_DAYS ngày để tránh MongoDB phình to
    cutoff = time.time() - SESSION_TTL_DAYS * 86400
    _col_sessions.delete_many({"created": {"$lt": cutoff}})
    return tok

@app.post("/api/login")
async def api_login(req: Request):
    d = await req.json()
    u, p = d.get("username","").strip(), d.get("password","")
    cap = d.get("hcaptcha_token","")
    if not u or not p: raise HTTPException(400, "Thiếu thông tin")
    if not _verify_hcaptcha(cap): raise HTTPException(400, "Xác minh captcha thất bại")
    if u in ADMIN_ACCOUNTS:
        if ADMIN_ACCOUNTS[u] != _hash(p): raise HTTPException(401, "Sai mật khẩu")
        tok = _create_session(u)
        return JSONResponse({"ok":True,"token":tok,"username":u,"is_admin":True,"email":"admin@dzi","joinDate":"2026"})
    user_doc = _col_users.find_one({"username": u})
    if not user_doc: raise HTTPException(401, "Tài khoản không tồn tại")
    if user_doc["pw"] != _hash(p): raise HTTPException(401, "Sai mật khẩu")
    tok = _create_session(u)
    return JSONResponse({"ok":True,"token":tok,"username":u,"is_admin":False,"email":user_doc.get("email",""),"joinDate":user_doc.get("joined","2026")})

@app.post("/api/register")
async def api_register(req: Request):
    d = await req.json()
    u, p, em = d.get("username","").strip(), d.get("password",""), d.get("email","").strip()
    cap = d.get("hcaptcha_token","")
    if not u or not p or not em: raise HTTPException(400, "Thiếu thông tin")
    if not _verify_hcaptcha(cap): raise HTTPException(400, "Xác minh captcha thất bại")
    if u in ADMIN_ACCOUNTS or _col_users.find_one({"username": u}): raise HTTPException(400, "Username đã tồn tại")
    if _col_users.find_one({"email": em.lower()}): raise HTTPException(400, "Email đã được sử dụng")
    if len(p) < 6: raise HTTPException(400, "Mật khẩu tối thiểu 6 ký tự")
    _col_users.insert_one({"username": u, "pw": _hash(p), "email": em, "joined": time.strftime("%d/%m/%Y"), "avatar": ""})
    tok = _create_session(u)
    return JSONResponse({"ok":True,"token":tok,"username":u,"is_admin":False,"email":em,"joinDate":time.strftime("%d/%m/%Y")})

@app.post("/api/logout")
async def api_logout(req: Request):
    tok = (req.headers.get("Authorization","")).replace("Bearer ","").strip()
    _col_sessions.delete_one({"token": tok})
    return JSONResponse({"ok":True})




@app.get("/api/user/profile")
async def api_profile(req: Request):
    u = _get_user(req)
    if not u: raise HTTPException(401, "Chưa đăng nhập")
    if u in ADMIN_ACCOUNTS:
        return JSONResponse({"username":u,"is_admin":True,"email":"admin@dzi","joinDate":"--","fav_count":0,"watch_count":0,"avatar":""})
    info = _col_users.find_one({"username": u}) or {}
    return JSONResponse({"username":u,"is_admin":False,"email":info.get("email",""),"joinDate":info.get("joined",""),"fav_count":0,"watch_count":0,"avatar":info.get("avatar","")})

@app.post("/api/user/change-password")
async def api_change_pw(req: Request):
    u = _get_user(req)
    if not u: raise HTTPException(401, "Chưa đăng nhập")
    if u in ADMIN_ACCOUNTS: raise HTTPException(403, "Admin dùng cách khác")
    d = await req.json()
    old_pw, new_pw = d.get("old_password",""), d.get("new_password","")
    user_doc = _col_users.find_one({"username": u}) or {}
    if user_doc.get("pw") != _hash(old_pw): raise HTTPException(400, "Mật khẩu cũ sai")
    if len(new_pw) < 6: raise HTTPException(400, "Mật khẩu mới tối thiểu 6 ký tự")
    _col_users.update_one({"username": u}, {"$set": {"pw": _hash(new_pw)}})
    return JSONResponse({"ok":True})

@app.post("/api/user/avatar")
async def api_avatar(req: Request):
    u = _get_user(req)
    if not u: raise HTTPException(401, "Chưa đăng nhập")
    d = await req.json()
    _col_users.update_one({"username": u}, {"$set": {"avatar": d.get("avatar","")[:200000]}})
    return JSONResponse({"ok":True})

# ── State ──────────────────────────────────────────────────
_client_id       = None
_client_id_ts    = 0
CLIENT_ID_TTL    = 3600  # tự refresh sau 1h
ID_FILE          = "id.txt"

# ── Headers — y chang bot Telegram ────────────────────────
def lay_headers():
    return {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://soundcloud.com/",
        "Upgrade-Insecure-Requests": "1",
    }

# ── Đọc client_id từ file id.txt ──────────────────────────
def doc_client_id_file():
    try:
        if os.path.exists(ID_FILE):
            with open(ID_FILE, "r") as f:
                cid = f.read().strip()
            if cid:
                print(f"📂 Dùng client_id từ id.txt: {cid[:10]}...")
                return cid
    except Exception as e:
        print(f"⚠️ Đọc id.txt lỗi: {e}")
    return None

# ── Ghi client_id vào file id.txt ─────────────────────────
def luu_client_id_file(cid):
    try:
        with open(ID_FILE, "w") as f:
            f.write(cid)
        print(f"💾 Đã lưu client_id vào id.txt")
    except Exception as e:
        print(f"⚠️ Ghi id.txt lỗi: {e}")

# ── Client ID — ưu tiên dùng id.txt, chỉ lấy mới nếu cần ──
def lay_client_id(force=False):
    global _client_id, _client_id_ts

    # 1. Dùng cache RAM nếu còn hạn
    if not force and _client_id and (time.time() - _client_id_ts < CLIENT_ID_TTL):
        return _client_id

    # 2. Đọc từ id.txt nếu có
    if not force:
        cid_file = doc_client_id_file()
        if cid_file:
            _client_id    = cid_file
            _client_id_ts = time.time()
            return _client_id

    # 3. Lấy mới từ SoundCloud
    try:
        res = requests.get("https://soundcloud.com/", headers=lay_headers(), timeout=12)
        soup = BeautifulSoup(res.text, "html.parser")

        script_tags = soup.find_all("script", {"crossorigin": True})
        urls = [t.get("src") for t in script_tags if t.get("src", "").startswith("https")]

        if not urls:
            urls = re.findall(r'src="(https://a-v2\.sndcdn\.com/assets/[^"]+\.js)"', res.text)

        if not urls:
            raise ValueError("Không tìm thấy script URL")

        js = requests.get(urls[-1], headers=lay_headers(), timeout=12).text
        m = re.search(r'client_id:"(.*?)"', js)
        if not m:
            raise ValueError("Không parse được client_id")

        _client_id    = m.group(1)
        _client_id_ts = time.time()
        luu_client_id_file(_client_id)
        print(f"✅ client_id mới: {_client_id[:10]}...")
        return _client_id

    except Exception as e:
        print(f"⚠️ Lấy client_id mới lỗi: {e}")

        # 4. Fallback: thử đọc lại id.txt lần cuối
        cid_file = doc_client_id_file()
        if cid_file:
            _client_id    = cid_file
            _client_id_ts = time.time()
            return _client_id

        # 5. Hardcode fallback cuối cùng
        print("⚠️ Dùng fallback hardcode")
        _client_id    = "iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX"
        _client_id_ts = time.time()
        return _client_id

# ── Lấy thông tin 1 bài — y chang bot Telegram ────────────
def lay_thong_tin_bai_hat(link: str):
    try:
        cid = lay_client_id()
        api_url = f"https://api-v2.soundcloud.com/resolve?url={link}&client_id={cid}"
        data = requests.get(api_url, headers=lay_headers(), timeout=8).json()
        art = (data.get("artwork_url") or data.get("user", {}).get("avatar_url") or "")
        art = art.replace("-large", "-t300x300")
        return {
            "id":     data.get("id", abs(hash(link))),
            "artist": data.get("user", {}).get("username", "Unknown"),
            "plays":  data.get("playback_count", 0),
            "likes":  data.get("likes_count", 0),
            "dur":    (data.get("duration") or 0) // 1000,
            "art":    art,
        }
    except:
        return {"id": abs(hash(link)), "artist": "Unknown", "plays": 0, "likes": 0, "dur": 0, "art": ""}

# ── Tìm nhạc — scrape m.soundcloud.com y chang bot ────────
def tim_nhac(tu_khoa: str):
    try:
        search_url = f"https://m.soundcloud.com/search?q={urllib.parse.quote(tu_khoa)}"
        response   = requests.get(search_url, headers=lay_headers(), timeout=12)
        soup       = BeautifulSoup(response.text, "html.parser")

        url_pattern  = re.compile(r"^/[^/]+/[^/]+$")
        raw_list     = []

        for element in soup.select("li > div"):
            a_tag = element.select_one("a")
            if not (a_tag and a_tag.has_attr("href")):
                continue
            relative_url = a_tag["href"]
            if not url_pattern.match(relative_url):
                continue

            ten     = a_tag.get("aria-label", "").strip()
            link    = "https://soundcloud.com" + relative_url
            img_tag = element.select_one("img")
            anh_bia = img_tag["src"] if img_tag and img_tag.has_attr("src") else ""
            raw_list.append((link, ten, anh_bia))

            if len(raw_list) >= 10:
                break

        if not raw_list:
            print(f"⚠️ Scrape '{tu_khoa}': không tìm thấy")
            return []

        tracks = [None] * len(raw_list)
        with ThreadPoolExecutor(max_workers=5) as pool:
            future_map = {
                pool.submit(lay_thong_tin_bai_hat, link): i
                for i, (link, _, _) in enumerate(raw_list)
            }
            for future in as_completed(future_map):
                i           = future_map[future]
                link, ten, anh_bia = raw_list[i]
                meta        = future.result()
                tracks[i]   = {
                    "id":     meta["id"],
                    "title":  ten or "Unknown",
                    "artist": meta["artist"],
                    "art":    meta["art"] or anh_bia,
                    "dur":    meta["dur"],
                    "plays":  meta["plays"],
                    "likes":  meta["likes"],
                    "url":    link,
                }

        tracks = [t for t in tracks if t]
        print(f"✅ Tìm '{tu_khoa}': {len(tracks)} bài")
        return tracks

    except Exception as e:
        print(f"❌ tim_nhac lỗi: {e}")
        return []

# ── Stream URL ─────────────────────────────────────────────
def lay_stream(permalink_url: str):
    for attempt in range(2):  # retry once với fresh client_id nếu 401/403
        cid = lay_client_id(force=(attempt > 0))
        resolve = f"https://api-v2.soundcloud.com/resolve?url={urllib.parse.quote(permalink_url)}&client_id={cid}"
        resp = requests.get(resolve, headers=lay_headers(), timeout=12)
        if resp.status_code in (401, 403) and attempt == 0:
            continue  # force refresh client_id rồi thử lại
        d   = resp.json()
        tcs = d.get("media", {}).get("transcodings", [])
        if not tcs:
            raise Exception("Không có stream")
        tc  = next((t for t in tcs if t.get("format", {}).get("protocol") == "progressive"), tcs[0])
        s   = requests.get(f"{tc['url']}?client_id={cid}", headers=lay_headers(), timeout=10).json()
        return s.get("url"), tc.get("format", {}).get("protocol")
    raise Exception("Hết lượt thử stream")

# ── Routes ─────────────────────────────────────────────────
@app.get("/")
@app.post("/")
@app.head("/")
def root():
    return {"ok": True, "server": "DZI Music & YouTube Server", "endpoints": ["/ping", "/search?q=...", "/stream?url=...", "/yt/search?q=...", "/yt/trending", "/yt/detail?videoId=..."]}
@app.get("/favicon.ico")
@app.head("/favicon.ico")
def favicon():
    # Trả về 204 No Content — không log lỗi, browser/scanner satisfied
    return Response(status_code=204)

@app.get("/ping")
def ping():
    return {"ok": True}

@app.get("/search")
def search(q: str = Query(...)):
    tracks = tim_nhac(q)
    return {"ok": True, "q": q, "count": len(tracks), "tracks": tracks}

@app.get("/stream")
def stream(url: str = Query(...)):
    try:
        audio_url, protocol = lay_stream(url)
        if not audio_url:
            raise HTTPException(502, "Không lấy được stream URL")
        return {"ok": True, "url": audio_url, "protocol": protocol}
    except HTTPException:
        raise
    except Exception as e:
        # Stream lỗi → force refresh client_id lần sau
        global _client_id, _client_id_ts
        _client_id    = None
        _client_id_ts = 0
        raise HTTPException(502, str(e))

# ── YouTube Routes ────────────────────────────────────────
@app.get("/yt/search")
def route_yt_search(q: str = Query(...), pageToken: str = Query("")):
    try:
        return yt_search(q, pageToken)
    except Exception as e:
        raise HTTPException(502, str(e))

@app.get("/yt/trending")
def route_yt_trending():
    try:
        return yt_trending()
    except Exception as e:
        raise HTTPException(502, str(e))

@app.get("/yt/shorts")
def route_yt_shorts(q: str = Query(""), pageToken: str = Query("")):
    try:
        return yt_shorts(q, pageToken)
    except Exception as e:
        raise HTTPException(502, str(e))

@app.get("/yt/detail")
def route_yt_detail(videoId: str = Query(...)):
    return yt_detail(videoId)

# ── Admin Stats ─────────────────────────────────────────────
# SITE_STATS từ MongoDB (dynamic)
def _get_site_stats():
    return {"trust_count": _get_stat("trust_count", 1247)}

@app.post("/api/admin/stats")
async def api_admin_stats(req: Request):
    u = _get_user(req)
    if not u or u not in ADMIN_ACCOUNTS:
        raise HTTPException(403, "Chỉ admin mới được cập nhật số liệu")
    d = await req.json()
    if "trust_count" in d:
        _set_stat("trust_count", int(d["trust_count"]))
    return JSONResponse({"ok": True, "stats": _get_site_stats()})

@app.get("/api/stats")
def api_get_stats():
    return JSONResponse(_get_site_stats())


# ── User Data (sync localStorage → MongoDB) ─────────────────
_col_userdata = _db["userdata"]

@app.get("/api/userdata")
async def api_userdata_get(req: Request):
    u = _get_user(req)
    if not u: raise HTTPException(401, "Chưa đăng nhập")
    doc = _col_userdata.find_one({"username": u}, {"_id": 0, "username": 0})
    return JSONResponse(doc or {})

@app.post("/api/userdata")
async def api_userdata_set(req: Request):
    u = _get_user(req)
    if not u: raise HTTPException(401, "Chưa đăng nhập")
    d = await req.json()
    # Chỉ cho phép các keys hợp lệ
    allowed = {"missions", "watchlist", "history", "music_history", "music_liked", "music_liked_tracks"}
    update = {k: v for k, v in d.items() if k in allowed}
    if update:
        _col_userdata.update_one({"username": u}, {"$set": update}, upsert=True)
    return JSONResponse({"ok": True})

# ── XvidAPI Proxy (tránh CORS cho frontend) ───────────────
XVID_BASE = "https://xvidapi.com/api.php/provide/vod"
XVID_SESS = requests.Session()

@app.get("/api/xvid")
def api_xvid(
    request: Request,
    ac: str = Query("detail"),
    t: str = Query(None),
    ids: str = Query(None),
    wd: str = Query(None),
    pg: int = Query(1),
    pagesize: int = Query(20),
    at: str = Query("json"),
    h: int = Query(None),
    sort_direction: str = Query(None),
    actor: str = Query(None),
    category: str = Query(None),
    code: str = Query(None),
):
    """Proxy request tới xvidapi.com, trả về JSON cho frontend."""
    params: dict = {"ac": ac, "pg": pg, "pagesize": min(pagesize, 100), "at": "json"}
    if t:              params["t"] = t
    if ids:            params["ids"] = ids
    if wd:             params["wd"] = wd
    if h:              params["h"] = h
    if sort_direction: params["sort_direction"] = sort_direction
    if actor:          params["actor"] = actor
    if category:       params["category"] = category
    if code:           params["code"] = code
    try:
        r = XVID_SESS.get(XVID_BASE, params=params, timeout=12)
        r.raise_for_status()
        return JSONResponse(r.json())
    except Exception as e:
        raise HTTPException(502, f"XvidAPI error: {e}")

# ── Catch-all cho bot scanners (ngăn 404 spam log) ────────
# Phải đặt SAU tất cả routes cụ thể để không shadow chúng
@app.api_route("/{full_path:path}", methods=["GET","POST","HEAD","OPTIONS","PUT","DELETE","PATCH"])
def catch_all(full_path: str, request: Request):
    return JSONResponse(status_code=404, content={"detail": "Not found"})

# ── Main ───────────────────────────────────────────────────
if __name__ == "__main__":
    PORT = int(os.environ.get("SERVER_PORT", os.environ.get("PORT", 20427)))
    print(f"🎵 DZI Music Server — http://prem-eu5.bot-hosting.cloud:{PORT}")
    print("⏳ Warm up client_id...")
    lay_client_id()
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=PORT,
        log_level="info",
        timeout_keep_alive=5,      # giảm keep-alive timeout để tránh bot connections treo
        limit_concurrency=100,
        access_log=True,
    )
