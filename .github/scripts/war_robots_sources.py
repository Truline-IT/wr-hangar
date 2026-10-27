"""Collect War Robots news for gragg.life from the developers and the community.

Writes, when each source answers:
  news/official.json      posts from the developers' news page, warrobots.com/en/news
  news/patch-notes.json   the newest "UPDATE NOTES" post, broken into balance changes
  news/reddit.json        r/walkingwarrobots posts (player posts, not official)

warrobots.com has no robots.txt, so its news page is read directly, a few requests per run.
Reddit only answers registered apps, so that part runs only when the REDDIT_CLIENT_ID and
REDDIT_CLIENT_SECRET secrets are set. warrobots.wiki asks AI tools not to use its content, so
nothing here reads it; the site links to it instead. YouTube lives in youtube_feed.py.
"""
import base64
import datetime as dt
import html
import json
import os
import re
import urllib.parse
import urllib.request

UA = "gragg.life-news/1.0 (+https://www.gragg.life/news/)"
SITE = "https://warrobots.com"


def get(url, headers=None, data=None):
    req = urllib.request.Request(url, data=data, headers={"User-Agent": UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "ignore")


def text_lines(page):
    page = re.sub(r"(?is)<(script|style|svg).*?</\1>", " ", page)
    t = html.unescape(re.sub(r"<[^>]+>", "\n", page))
    t = re.sub(r"[ \t]+", " ", t)
    return [x.strip() for x in t.split("\n") if x.strip()]


def write(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write("\n")


# ---------- developers' news ----------
def official_posts():
    page = get(SITE + "/en/news")
    posts, seen = [], set()
    for m in re.finditer(r'<a [^>]*href="(?:https://warrobots\.com)?/en/posts/(\d+)"[^>]*>(.*?)</a>', page, re.S):
        pid, block = m.group(1), m.group(2)
        title = re.search(r"<h[34][^>]*>(.*?)</h[34]>", block, re.S)
        if not title or pid in seen:
            continue
        seen.add(pid)
        spans = [html.unescape(re.sub(r"<[^>]+>", "", s)).strip() for s in re.findall(r"<span[^>]*>(.*?)</span>", block, re.S)]
        img = re.search(r'<img src="([^"]+)"', block)
        posts.append({
            "id": int(pid),
            "title": html.unescape(re.sub(r"<[^>]+>", "", title.group(1))).strip(),
            "category": spans[0] if spans else "",
            "date": spans[1] if len(spans) > 1 else "",
            "url": f"{SITE}/en/posts/{pid}",
            "img": img.group(1) if img else "",
        })
    posts.sort(key=lambda p: p["id"], reverse=True)
    return posts


HEADS = {"ROBOTS": "Robots", "ROBOT WEAPONS": "Robot weapons", "DRONES": "Drones", "ROBOT PILOTS": "Robot pilots",
         "TITANS": "Titans", "TITAN WEAPONS": "Titan weapons", "MOTHERSHIPS": "Motherships", "MODULES": "Modules",
         "TITAN PILOTS": "Titan pilots", "SPECIALIZATIONS": "Specializations", "TECHNICAL FIXES": "Fixes",
         "BUG FIXES": "Fixes", "FIXES": "Fixes"}
GENERIC = {"mk2", "mk3", "ultimate", "noir", "blaze", "frozen", "retro", "cryptic", "freedom", "eldritch", "spirit", "steel",
           "sport", "royal", "omen", "unknown", "cruel", "fatal", "prototype", "ardent", "quicksand", "stellar", "floor", "the", "of"}


def owned_words():
    try:
        items = json.load(open("shared/search-index.json", encoding="utf-8"))["items"]
    except (OSError, ValueError, KeyError):
        return set()
    words = set()
    for x in items:
        if x["k"] in ("Robot", "Titan", "Weapon", "Drone"):
            for w in re.split(r"[\s/()-]+", x["t"].lower()):
                if len(w) > 2 and w not in GENERIC:
                    words.add(w)
    return words


def parse_update(post):
    lines = text_lines(get(post["url"]))
    ver = re.search(r"(\d+\.\d+(?:\.\d+)?)", post["title"])
    ver = ver.group(1) if ver else post["title"]
    try:
        start = lines.index(post["title"].upper()) if post["title"].upper() in lines else lines.index(post["title"])
    except ValueError:
        start = 0
    subtitle = lines[start + 1] if start + 1 < len(lines) else ""
    highlights = [x for x in lines[start:start + 60] if re.match(r"^New [a-z ]+:", x)][:8]
    groups = []
    if "BALANCE CHANGES" in lines:
        a = len(lines) - 1 - lines[::-1].index("BALANCE CHANGES")
        mine = owned_words()
        cur = item = None
        for x in lines[a + 1:]:
            if x.startswith("Disclaimer") or x in ("Share", "News", "Community") or x.lower().startswith("download"):
                break
            if x in HEADS:
                cur = {"head": HEADS[x], "items": []}
                groups.append(cur)
                item = None
                continue
            if cur is None:
                continue
            is_change = "→" in x or x.startswith("- ") or x.endswith(":") or bool(re.match(r"^(Special skills|On |While |Improved |Gray |Damage|Ability|Aegis|Durability|Movement|Reload|Shot|Ammo|Time to|Projectile|AoE|Horizontal|Duration|Stealth|Repairable|Invisibility|Line Of|Tracking|Event Horizon)", x))
            if cur["head"] == "Fixes":
                cur["items"].append({"name": x, "lines": [], "mine": False})
                continue
            if item is None or not is_change:
                words = {w for w in re.split(r"[\s/()-]+", x.lower()) if len(w) > 2}
                item = {"name": x, "lines": [], "mine": bool(words & mine)}
                cur["items"].append(item)
            else:
                item["lines"].append(x)
        groups = [g for g in groups if g["items"]]
    return {"ver": ver, "title": subtitle.title() if subtitle.isupper() else subtitle, "date": post["date"],
            "url": post["url"], "source": "Official update notes", "highlights": highlights, "groups": groups,
            "auto": True}


def update_official():
    posts = official_posts()
    if not posts:
        print("Developers' news: no posts found, page layout may have changed.")
        return
    write("news/official.json", {"source": SITE + "/en/news", "checked": dt.date.today().isoformat(), "posts": posts[:30]})
    print(f"Developers' news: {len(posts)} posts, newest {posts[0]['title']}")
    notes = next((p for p in posts if "UPDATE NOTES" in p["title"].upper()), None)
    if not notes:
        return
    pn = json.load(open("news/patch-notes.json", encoding="utf-8"))
    if pn["latest"]["url"] == notes["url"]:
        return
    new = parse_update(notes)
    if not new["groups"] and not new["highlights"]:
        print("Update notes found but could not be read; leaving patch notes as they are.")
        return
    pn.setdefault("archive", []).insert(0, pn["latest"])
    pn["latest"], pn["updated"] = new, dt.date.today().isoformat()
    write("news/patch-notes.json", pn)
    print(f"Patch notes: posted {new['ver']}")


# ---------- Reddit ----------
def update_reddit():
    cid, secret = os.environ.get("REDDIT_CLIENT_ID", ""), os.environ.get("REDDIT_CLIENT_SECRET", "")
    if not cid or not secret:
        print("Reddit: REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET not set, skipping.")
        return
    auth = base64.b64encode(f"{cid}:{secret}".encode()).decode()
    tok = json.loads(get("https://www.reddit.com/api/v1/access_token", {"Authorization": "Basic " + auth},
                         urllib.parse.urlencode({"grant_type": "client_credentials"}).encode()))["access_token"]
    listing = json.loads(get("https://oauth.reddit.com/r/walkingwarrobots/hot?limit=25&raw_json=1",
                             {"Authorization": "bearer " + tok}))
    posts = []
    for c in listing["data"]["children"]:
        d = c["data"]
        if d.get("stickied") and d.get("score", 0) < 5 or d.get("over_18"):
            continue
        posts.append({"title": d["title"], "url": "https://www.reddit.com" + d["permalink"], "flair": d.get("link_flair_text") or "",
                      "score": d.get("score", 0), "comments": d.get("num_comments", 0),
                      "created": dt.datetime.utcfromtimestamp(d["created_utc"]).isoformat() + "Z"})
    write("news/reddit.json", {"source": "https://www.reddit.com/r/walkingwarrobots/", "checked": dt.date.today().isoformat(),
                               "note": "Player posts, not official", "posts": posts[:20]})
    print(f"Reddit: {len(posts)} posts")


if __name__ == "__main__":
    for job in (update_official, update_reddit):
        try:
            job()
        except Exception as e:  # one source failing must not stop the others
            print(f"{job.__name__} failed: {e}")
