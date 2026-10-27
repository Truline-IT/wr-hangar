"""List the newest videos on the official War Robots YouTube channel and write news/videos.json.

Uses the YouTube Data API (the uploads playlist of the channel). YouTube's robots.txt asks
automated tools not to read /feeds/videos.xml, so this script never touches the RSS feed.
Needs a YouTube Data API key in the YT_API_KEY environment variable (a GitHub Actions secret).
"""
import json
import os
import sys
import urllib.parse
import urllib.request

CHANNEL_ID = "UCUONs6Dma0w6iDbKUk5cvBg"          # youtube.com/@playwarrobots
UPLOADS = "UU" + CHANNEL_ID[2:]                    # every channel's uploads playlist
OUT = "news/videos.json"


def main():
    key = os.environ.get("YT_API_KEY", "")
    if not key:
        print("YT_API_KEY is not set; leaving news/videos.json as it is.")
        return
    q = urllib.parse.urlencode({"part": "snippet", "playlistId": UPLOADS, "maxResults": 15, "key": key})
    with urllib.request.urlopen("https://www.googleapis.com/youtube/v3/playlistItems?" + q, timeout=30) as r:
        items = json.load(r).get("items", [])
    videos = []
    for it in items:
        s = it["snippet"]
        vid = s["resourceId"]["videoId"]
        thumbs = s.get("thumbnails", {})
        thumb = (thumbs.get("high") or thumbs.get("medium") or thumbs.get("default") or {}).get("url") \
            or f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"
        videos.append({
            "id": vid,
            "title": s["title"],
            "published": s["publishedAt"],
            "url": f"https://www.youtube.com/watch?v={vid}",
            "thumb": thumb,
            "summary": (s.get("description") or "").strip().split("\n")[0][:220],
        })
    if not videos:
        sys.exit("The API returned no videos; keeping the old file.")
    videos.sort(key=lambda v: v["published"], reverse=True)
    data = {"channel": "War Robots", "channel_url": "https://www.youtube.com/@playwarrobots", "videos": videos}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"{len(videos)} videos, newest: {videos[0]['title']}")


if __name__ == "__main__":
    main()
