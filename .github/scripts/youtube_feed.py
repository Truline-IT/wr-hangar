"""Fetch the official War Robots YouTube feed and write news/videos.json for the site."""
import json
import sys
import urllib.request
import xml.etree.ElementTree as ET

FEED = "https://www.youtube.com/feeds/videos.xml?channel_id=UCUONs6Dma0w6iDbKUk5cvBg"
OUT = "news/videos.json"
NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015",
      "media": "http://search.yahoo.com/mrss/"}


def main(source=None):
    raw = open(source, "rb").read() if source else urllib.request.urlopen(FEED, timeout=30).read()
    root = ET.fromstring(raw)
    videos = []
    for e in root.findall("a:entry", NS):
        vid = e.findtext("yt:videoId", namespaces=NS)
        desc = (e.findtext("media:group/media:description", default="", namespaces=NS) or "").strip()
        videos.append({
            "id": vid,
            "title": e.findtext("a:title", namespaces=NS),
            "published": e.findtext("a:published", namespaces=NS),
            "url": f"https://www.youtube.com/watch?v={vid}",
            "thumb": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
            "summary": desc.split("\n")[0][:220],
        })
    if not videos:
        sys.exit("Feed had no videos; keeping the old file.")
    data = {"channel": "War Robots", "channel_url": "https://www.youtube.com/@playwarrobots", "videos": videos}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"{len(videos)} videos, newest: {videos[0]['title']}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else None)
